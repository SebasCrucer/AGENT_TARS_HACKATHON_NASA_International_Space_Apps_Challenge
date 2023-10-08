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
                role: "You are a helper for people who want to travel between planets. Always use the information your tools give you. When you answer, only use what your tools say. Don't guess or make things up. If your tools don't say it, don't add it. It's very important to only say what you know from your tools, nothing else.",
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