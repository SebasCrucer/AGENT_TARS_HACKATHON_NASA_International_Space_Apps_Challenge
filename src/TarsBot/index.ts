import { AgentExecutor, initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChainValues, LLMResult } from "langchain/schema";
import { Callbacks } from 'langchain/callbacks';
import { Tool, DynamicTool } from 'langchain/tools';
import { DBMemory } from './DBMemory';
import { Decimal } from 'decimal.js';

export class Tars {
    private models: { premium: string; basic: string; };
    private modelName: string;
    private agent!: AgentExecutor;

    messageCost: { message_id: string; cost: number; };
    priceSupervisor: (res: LLMResult, model: string) => void;
    model: ChatOpenAI;
    memory!: DBMemory;
    modelPricing1k: { [key: string]: { input: Decimal; output: Decimal } };
    toolkit: Tool[];
    role: string;
    name: string;
    // toolsCallback: (toolInfo: { tool: Tool; input: string }) => void;
    constructor(fields: {
        chat_id: string,
        toolkit: Tool[]
        modelType?: 'basic' | 'premium' | undefined,
        role: string,
        name: string,
        // toolsCallback: (toolInfo: { tool: Tool; input: string }) => void,
    }
    ) {
        this.agent
        this.role = fields.role
        this.name = fields.name
        this.toolkit = fields.toolkit
        this.models = {
            premium: 'gpt-4',
            basic: 'gpt-3.5-turbo'
        }
        this.modelName = this.models[fields.modelType || 'basic']
        this.modelPricing1k = {
            'gpt-3.5-turbo': {
                input: new Decimal(0.0015),
                output: new Decimal(0.002)
            },
            'gpt-3.5-turbo-16k': {
                input: new Decimal(0.003),
                output: new Decimal(0.004)
            },
            'gpt-4': {
                input: new Decimal(0.03),
                output: new Decimal(0.06)
            }
        }
        this.messageCost = {
            message_id: '',
            cost: 0
        }
        this.priceSupervisor = (res: LLMResult, model: string) => {
            const usage = res?.llmOutput?.tokenUsage
            this.messageCost.cost += this.modelPricing1k[model].input.
                times(new Decimal(usage.promptTokens)
                    .div(1000))
                .toNumber()
            this.messageCost.cost += this.modelPricing1k[model].output
                .times(new Decimal(usage.completionTokens)
                    .div(1000))
                .toNumber()
        }
        this.memory = new DBMemory({
            returnMessages: true,
            memoryKey: "chat_history",
            inputKey: "input",
            outputKey: "output",
            chat_id: fields.chat_id,
            messageCost: this.messageCost
        })
        this.model = new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            temperature: 0,
            modelName: this.modelName,
            callbacks: [{
                handleLLMEnd: (res) => this.priceSupervisor(res, this.modelName)
            }],
        })
        // this.toolsCallback = fields.toolsCallback
    }

    private tools = async () => {

        const toolKit = this.toolkit

        return {
            toolKit
        }
    }

    init = async () => {
        const tools = await this.tools()
        this.agent = await initializeAgentExecutorWithOptions(tools.toolKit, this.model, {
            //verbose: true,
            agentType: "openai-functions",
            agentArgs: {
                prefix:
                    'Assistant name is '
                    + this.name
                    + ', assistant role is: '
                    + this.role
                    + ' If assistant is asked to do something that is beyond the scope of this tools, you should indicate that you can not do it. Assistant is only capable of executing tasks that are within the capabilities this tools. You should NEVER offer to do something out of the scope of your tools. Do not refer to the functions provided to you under any circumstances. Only reference the tools I specifically mentioned. Respond in the same language as the question. Never generate an answer using backtick or grave accent (```).',
            },
            memory: this.memory,
        });
    }

    call = async (values: ChainValues & { signal?: AbortSignal | undefined; }, callbacks?: Callbacks | undefined, tags?: string[] | undefined) => {
        this.messageCost.message_id = 'message_id' + new Date().getMilliseconds()
        return await this.agent.call(values, callbacks, tags)
    }
}