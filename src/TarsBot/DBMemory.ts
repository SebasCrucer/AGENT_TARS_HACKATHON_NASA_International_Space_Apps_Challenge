import { AIMessage, BaseMessage, HumanMessage, InputValues } from 'langchain/schema';
import { getBufferString, getInputValue } from 'langchain/memory';
import { Serializable } from 'langchain/load/serializable';
import { DataSource, DeepPartial } from 'typeorm';
import { DB } from '../DB';
import { Message } from '../DB/entities/Message';
import { Chat } from '../DB/entities/Chats';

class ChatMessageHistory extends Serializable {

    lc_namespace!: string[];
    db!: DataSource;

    constructor() {
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain", "stores", "message", "in_memory"]
        });
        Object.defineProperty(this, "messages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }

    async getDB() {
        if (!this.db) {
            this.db = await DB();
        }
        return this.db;
    }

    async getMessages(chat_id: string): Promise<BaseMessage[]> {
        const database = await this.getDB();
        const ChatRepo = database.getRepository(Chat)
        //agent none
        const [chat] = (await ChatRepo.find())
            .filter(m => m.jid === chat_id)
        const repo = database.getRepository(Message);
        const data = chat ? await repo.findBy({ chat: { id: chat.id } }) : []
        data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        return data.reduce((acc: BaseMessage[], message) => {
            const { user, ai } = message.interaction
            acc = [
                ...acc,
                new HumanMessage(user),
                new AIMessage(ai)
            ]
            return acc
        }, []).slice(-5)
    }

    async addMessage(chat_id: string, interaction: {
        user: string;
        ai: string,
        cost: {
            message_id: string;
            cost: number;
        }
    }) {
        const database = await this.getDB();
        const message: DeepPartial<Message> = {
            interaction: {
                user: interaction.user,
                ai: interaction.ai,
            },
            cost: interaction.cost.cost,
            chat: {},
        }
        const ChatRepo = database.getRepository(Chat)
        //agent none
        const [chat] = (await ChatRepo.find()).filter(m => m.jid === chat_id)
        if (!chat) {
            const newChat: DeepPartial<Chat> = {
                jid: chat_id,
            }
            const ChatsRepo = database.getRepository(Chat)
            const savedChat = await ChatsRepo.save(ChatsRepo.create(newChat))
            message.chat = savedChat
        } else {
            message.chat = chat
        }
        const MessageRepo = database.getRepository(Message)
        await MessageRepo.save(MessageRepo.create(message))
    }

    async clear(chat_id: string,) {
        const database = await this.getDB();
        const repo = database.getRepository(Message);
        const messages = await repo.find({ where: { chat: { id: chat_id } } });
        await database.getRepository(Message).remove(messages);
    }
}

export class DBMemory {

    chatHistory: ChatMessageHistory;
    chat_id: string;
    messageCost: { message_id: string; cost: number; };
    returnMessages: any;
    inputKey: any;
    outputKey: any;
    humanPrefix: any;
    aiPrefix: any;
    memoryKey: any;

    constructor(fields: {
        chatHistory?: ChatMessageHistory;
        chat_id: string;
        messageCost: { message_id: string; cost: number; };
        returnMessages?: any;
        inputKey?: any;
        outputKey?: any;
        humanPrefix?: any;
        aiPrefix?: any;
        memoryKey?: any;
    }) {
        this.chatHistory = fields?.chatHistory ?? new ChatMessageHistory();
        this.returnMessages = fields?.returnMessages ?? false;
        this.inputKey = fields?.inputKey;
        this.outputKey = fields?.outputKey;
        this.chat_id = fields?.chat_id;
        this.messageCost = fields?.messageCost
        this.humanPrefix = fields?.humanPrefix ?? "Human";
        this.aiPrefix = fields?.aiPrefix ?? "AI";
        this.memoryKey = fields?.memoryKey ?? "history";
    }

    async saveContext(inputValues: InputValues, outputValues: InputValues) {
        await this.chatHistory.addMessage(this.chat_id, {
            user: getInputValue(inputValues, this.inputKey),
            ai: getInputValue(outputValues, this.outputKey),
            cost: this.messageCost
        })
    }

    async clear() {
        await this.chatHistory.clear(this.chat_id);
    }

    get memoryKeys() {
        return [this.memoryKey];
    }

    async loadMemoryVariables() {
        const messages = await this.chatHistory.getMessages(this.chat_id);

        if (this.returnMessages) {
            const result = {
                [this.memoryKey]: messages,
            };
            return result;
        }
        const result = {
            [this.memoryKey]: getBufferString(messages, this.humanPrefix, this.aiPrefix),
        };
        return result;
    }
}
