import { Tars } from './TarsBot';
import { GetAbleRockets } from './TarsBot/Tools/GetAbleRockets';
import { GetAllPlanetProperties } from './TarsBot/Tools/GetAllPlanetProperties';
import { GetPlanetProperties } from './TarsBot/Tools/GetPlanetProperties';
import { TravelTimeCalculator } from './TarsBot/Tools/TravelTimeCalculation';
import { Callbacks } from './WhatsApp';

export type params = {
    iTool?: boolean;
    modelType?: "basic" | "premium",
    role: string,
    name: string,
    respondTo: {
        type: 'exclusive' | 'specific' | 'all',
        exclusive: string[],
        specific: string[],
    }
}

const generateResponse: (
    jid: string,
    input: string,
    agent_id: string,
    params: params,
    sendMessage: (message: string) => void
) => Promise<string> = async (jid, input, agent_id, params, sendMessage) => {
    try {
        const agent = new Tars({
            chat_id: jid,
            toolkit: [
                await new GetPlanetProperties({
                    toolCallback(feedBack) {
                        sendMessage(feedBack)
                    },
                }).getDynamicTool(),
                await new GetAllPlanetProperties({
                    toolCallback(feedBack) {
                        sendMessage(feedBack)
                    },
                }).getDynamicTool(),
                await new GetAbleRockets({
                    toolCallback(feedBack) {
                        sendMessage(feedBack)
                    },
                }).getDynamicTool(),
                await new TravelTimeCalculator({
                    toolCallback(feedBack) {
                        sendMessage(feedBack)
                    },
                }).getDynamicTool(),
            ],
            modelType: params.modelType,
            name: params.name,
            role: params.role,
        });
        await agent.init()
        const result = await agent.call({
            input: input
        });
        console.log(agent.messageCost);
        return result.output
    } catch (err) {
        const error = err as any
        console.log('Error generating response: ', error);
        throw error
    }
}

export const events: (params: params) => Callbacks = (params) => ({
    "messages.upsert": async (m, socket, agent_id) => {
        const { message, key } = m.messages[0]
        const { remoteJid, fromMe, id } = key
        const messageType = message?.documentWithCaptionMessage
            ? "documentWithCaptionMessage"
            : message ? Object.keys(message)[0] : undefined;
        const messageText = messageType === "conversation" ?
            message?.conversation :
            messageType === "extendedTextMessage" ?
                message?.extendedTextMessage?.text :
                undefined;

        console.log('mensajwe');

        if (remoteJid && messageText && !fromMe && remoteJid !== 'status@broadcast') {
            if (
                params.respondTo.type === 'specific' ?
                    params.respondTo.specific.includes(remoteJid.split("@")[0]) :
                    params.respondTo.type === 'exclusive' ?
                        !params.respondTo.exclusive.includes(remoteJid.split("@")[0]) :
                        params.respondTo.type === 'all'
            ) {
                await socket.readMessages([
                    {
                        remoteJid,
                        id
                    },
                ]);
                let isWriting = true;
                (async () => {
                    while (isWriting) {
                        await socket.sendPresenceUpdate("composing", remoteJid);
                        await new Promise(resolve => setTimeout(resolve, 8000));
                    }
                })();
                const response = await generateResponse(
                    remoteJid,
                    messageText,
                    agent_id,
                    params,
                    (message) => {
                        socket.sendMessage(remoteJid, {
                            text: message
                        })
                    }
                )
                isWriting = false
                await socket.sendPresenceUpdate("paused", remoteJid);
                response && socket.sendMessage(remoteJid, {
                    text: response
                })
            }
        }
    },
})