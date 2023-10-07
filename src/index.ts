import { config } from 'dotenv';
import { Auth } from './WhatsApp/Bottle/entity/Auth';
import bootleDB from './WhatsApp/Bottle/DB';
import { DB } from './DB';
import { AgentHandler } from './AgentHandler';
import { generate } from 'qrcode-terminal';

(async () => {
    config()
    await DB()
    try {
        const ds = await bootleDB.get({
            type: 'postgres',
            url: process.env.WA_DATABASE_URL,
            ssl: true
        })
        const repo = ds.getRepository(Auth)
        const keys = await repo.createQueryBuilder('auth')
            .select('auth.key')
            .getMany()
        const promisesInit = keys.map(async ({ key: agentId }) => {
            const agent = new AgentHandler({ agentId })
            const iniRes = await agent.init({
                forceInit: true,
                async connection_closed_callback(res, userId) {
                },
                async connection_open_callback(res, userId) {
                },
                async QRCallback(QR) {
                    generate(QR, { small: true })
                }
            })
            console.log(iniRes);
        })
        await Promise.all(promisesInit)
        console.log('Successful initialization!');
    } catch (error) {
        console.log('Error at initialization :(');
        console.log(error);
    }
})()