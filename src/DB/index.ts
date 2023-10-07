import { DataSource } from "typeorm"
import { Chat } from "./entities/Chats"
import { Message } from "./entities/Message"

export const DB: () => Promise<DataSource> = async () => {
    const DB = await new DataSource({
        type: 'postgres',
        url: process.env.TARS_DATABASE_URL,
        ssl: true,
        entities: [
            Chat,
            Message
        ]
    }).initialize()
    await DB.synchronize()
    return DB
}