import { ObjectLiteral } from "typeorm"
import { DBActions } from "./DB/DBActions"
import { StatusCode, WhatsAppClient, WhatsAppSessions } from "./WhatsApp"
import { events, params } from "./events"
import { throwError } from "./Utils/throwError"
import { Auth } from "./WhatsApp/Bottle/entity/Auth"
import DB from "./WhatsApp/Bottle/DB"

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
                EjemploPlugin: [
                    {
                        nombre: "Plugin1",
                        id: "abc123"
                    },
                    {
                        nombre: "Plugin2",
                        id: "def456"
                    }
                ],
                iTool: true,
                modelType: "premium",
                role: "Eres un asistente bien loco.",
                name: "Juan Perez",
                respondTo: {
                    type: "specific",
                    exclusive: [],
                    specific: ["52144214738989"]
                }
            }

            const client = new WhatsAppClient(this.agentId)
            client.callbacks = events(config)
            client.maxQRretries = 1
            client.QRTimeout = 30_000
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