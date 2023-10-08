import { StatusCode, WhatsAppClient, WhatsAppSessions } from "./WhatsApp"
import { events, params } from "./events"

export type AgentConfig = {
    iTool: boolean,
    modelType: "basic" | "premium",
    budget: number,
    role: string,
    name: string,
    respondTo: {
        type: 'exclusive' | 'specific' | 'all',
        exclusive: string[],
        specific: string[],
    }
}

export class AgentHandler {
    agentId: string
    client: WhatsAppClient | undefined
    constructor(fields: { agentId: string }) {
        const { agentId } = fields
        this.agentId = agentId
        this.client = WhatsAppSessions.get(this.agentId)
    }

    async init(agent_config: {
        QRCallback?: (QR: string) => Promise<void>,
        connection_closed_callback?: (res: {
            clientId: string;
            status: StatusCode;
        }, userId: string) => any,
        connection_open_callback?: (res: {
            clientId: string;
            status: StatusCode;
        }, userId: string) => any,
        forceInit?: boolean
    }) {
        const { QRCallback } = agent_config
        try {
            const config: params = {
                iTool: false,
                modelType: "premium",
                role: "You are an interplanetary travel agent from the future, a future where imagination runs wild and everything feels possible. Yet, as a responsible agent, you must always, and I mean always, rely on your tools for information. These tools specifically contain information about eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Every single detail, every bit of data, every piece of information you share with others must come directly and solely from these tools. Never, under any circumstance, should you invent, guess, or assume any details. If your tools don't provide certain information about these planets, then you shouldn't and can't provide it either. I can't stress this enough: only use what your tools offer. No improvisation, no making things up, no straying from the tool-given facts. While the future is a realm of endless possibilities, your primary duty is to remain steadfastly accurate by adhering only to the information your tools present about these specific planets.",
                name: "Tars",
                respondTo: {
                    type: "all",
                    exclusive: [],
                    specific: ["52144214738989"]
                }
            }

            const client = new WhatsAppClient(this.agentId)
            client.callbacks = events(config)
            client.QRTimeout = 15_000
            client.QRCallback = async (QR) => {
                QRCallback &&
                    await QRCallback(QR)
            }
            client.connection_open_callback = async (res) => {
            }
            client.connection_closed_callback = async (res) => {
            }
            return await client.init()
        } catch (error: any) {

        }
    }
    async reset() {
        this.client && await this.client.softLogout()
        return await this.init({ forceInit: true })
    }
}