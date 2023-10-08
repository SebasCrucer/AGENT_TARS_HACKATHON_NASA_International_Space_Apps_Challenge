import 'dotenv/config';
import makeWASocket, {
    AuthenticationState,
    BaileysEventMap,
    Browsers,
    DisconnectReason,
    fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import log from "@whiskeysockets/baileys/lib/Utils/logger";
import { Boom } from "@hapi/boom";
import { BBottle } from './Bottle';
import StoreHandle from './Bottle/bottle/StoreHandle';
import { DataSourceOptions } from 'typeorm';

export const WhatsAppSessions: Map<string, WhatsAppClient> = new Map();

type CallbackElement<T extends keyof BaileysEventMap> = (
    arg: BaileysEventMap[T],
    socket: ReturnType<typeof makeWASocket>,
    agent_id: string
) => void;

export type Callbacks = {
    [K in keyof BaileysEventMap]?: CallbackElement<K>
} | undefined

export enum StatusCode {
    CONNECTED = 'The client is connected.',
    OFFLINE = 'The client is offline.',
    LOGGED_OUT = 'The client has logged out.',
    ERROR = 'An error occurred.',
    CONNECTING = 'The client is connecting.',
    SOFT_LOGOUT = 'The client has performed a soft logout.',
    INITIAL_ERROR_LOGOUT = 'The client logged out due to an initial error.',
    QR_TIMEOUT_LOGOUT = 'The client logged out due to QR code timeout.'
}

export class WhatsAppClient {
    private deleteStore!: (storeName: string) => Promise<void>
    private saveState!: () => Promise<any>
    private clientId: string;
    private store!: StoreHandle
    private state!: AuthenticationState
    private logger: any;
    private sock!: ReturnType<typeof makeWASocket>
    status: StatusCode
    maxQRretries: number = 5
    QRcount: number
    callbacks: Callbacks = undefined
    logout_callback: ((fields: {
        clientId: string;
        status: StatusCode;
    }) => any) | undefined
    connection_closed_callback: ((fields: {
        clientId: string;
        status: StatusCode;
    }) => any) | undefined
    connection_open_callback: ((fields: {
        clientId: string;
        status: StatusCode;
    }) => any) | undefined
    QRCallback: ((QR: string) => Promise<void>) | undefined
    isInitial: boolean
    dataSourceOptions: DataSourceOptions;
    QRTimeout: number = 10_000

    constructor(clientId: string) {
        this.status = StatusCode.OFFLINE
        this.isInitial = false
        this.QRcount = 0
        this.clientId = clientId
        this.logger = log.child({})
        this.dataSourceOptions = {
            type: "postgres",
            url: process.env.WA_DATABASE_URL,
            ssl: true
        }
    }

    private client = async () => {
        try {
            console.log(`Starting client "${this.clientId}"`);
            this.logger.level = "silent";
            const { createStore, deleteStore } = await BBottle.init(this.dataSourceOptions);
            const { auth, store } = await createStore(this.clientId);
            const { state, saveState } = await auth.useAuthHandle();
            this.deleteStore = deleteStore
            this.store = store
            this.state = state
            this.saveState = saveState
        } catch (error) {
            console.log('Error at WhatsAppClient on client: ', error);
            this.status = StatusCode.ERROR
            throw error
        }
    }

    private startSocket = async () => {
        try {
            await this.client()
            const { version } = await fetchLatestBaileysVersion();
            this.sock = makeWASocket({
                version,
                auth: this.state,
                logger: this.logger,
                qrTimeout: this.QRTimeout,
                browser: Browsers.appropriate('Tars'),
                printQRInTerminal: true,
            });
            this.store.bind(this.sock)
            this.sock.ev.process(async (events: Partial<BaileysEventMap>) => {
                if (this.callbacks) {
                    Object.keys(this.callbacks).forEach((event) => {
                        const eventAsKey = event as keyof BaileysEventMap;
                        const callback = this.callbacks![eventAsKey] as CallbackElement<typeof eventAsKey>
                        const eventValue = events[eventAsKey]
                        eventValue && callback!(eventValue, this.sock, this.clientId);
                    });
                }
                if (events["creds.update"]) {
                    await this.saveState()
                }
                if (events["connection.update"]) {
                    const update = events["connection.update"];
                    const { connection, lastDisconnect, qr } = update;
                    qr &&
                        (async () => {
                            this.QRcount >= this.maxQRretries ?
                                await (async () => {
                                    this.status = StatusCode.QR_TIMEOUT_LOGOUT
                                    await this.logout()
                                })() :
                                this.QRCallback && await this.QRCallback(qr)
                            this.QRcount += 1
                        })()
                    if (connection === "open") {
                        WhatsAppSessions.set(this.clientId, this)
                        this.status = StatusCode.CONNECTED
                        this.connection_open_callback && await this.connection_open_callback({
                            clientId: this.clientId,
                            status: this.status
                        })
                    } else if (connection === "close") {
                        await this.handleConnectionClose(lastDisconnect)
                    }
                }
            });
        } catch (error) {
            console.log('Error at WhatsAppClient on startSocket: ', error);
            this.status = StatusCode.ERROR
            throw error
        }
    }

    private handleConnectionClose = async (lastDisconnect: {
        error: Error | undefined;
        date: Date;
    } | undefined) => {
        try {
            await this.sock.ws.close()
            WhatsAppSessions.delete(this.clientId)
            if (
                (lastDisconnect?.error as Boom)?.output?.statusCode
                !== DisconnectReason.loggedOut
            ) {
                if (this.isInitial) {
                    const errorPayload = (lastDisconnect?.error as Boom).output.payload
                    console.log(
                        this.clientId +
                        ' logout: ' +
                        errorPayload.message +
                        ' Status: ' +
                        errorPayload.statusCode
                    );
                    this.status = StatusCode.INITIAL_ERROR_LOGOUT
                    await this.logout()
                } else {
                    this.status !== StatusCode.SOFT_LOGOUT && this.startSocket();
                }
            } else {
                if (this.status !== StatusCode.QR_TIMEOUT_LOGOUT) {
                    this.status = StatusCode.LOGGED_OUT
                }
                this.connection_closed_callback && await this.connection_closed_callback({
                    clientId: this.clientId,
                    status: this.status
                })
                console.log(
                    this.clientId +
                    " Connection closed."
                );
                await this.deleteStore(this.clientId);
            }
        } catch (error) {
            console.log('Error handling closed connection: ', error);
        }
    }

    init = async () => {
        this.status = StatusCode.CONNECTING
        try {
            await this.startSocket();
            const initEndStatuses = [
                StatusCode.CONNECTED,
                StatusCode.ERROR,
                StatusCode.INITIAL_ERROR_LOGOUT,
                StatusCode.LOGGED_OUT,
            ];
            await new Promise((resolve) => {
                const checkConnection = () => {
                    this.status === StatusCode.QR_TIMEOUT_LOGOUT ?
                        resolve({}) :
                        initEndStatuses.includes(this.status)
                            ? resolve({})
                            : setTimeout(checkConnection, 1000);
                };
                checkConnection()
            })
            return {
                clientId: this.clientId,
                status: this.status
            }
        } catch (error) {
            console.log('Error initializing WhatsAppClient: ', error);
            this.status = StatusCode.ERROR
            return {
                clientId: this.clientId,
                status: this.status,
                error
            }
        }
    }

    logout = async () => {
        await this.sock.logout()
        await new Promise((resolve) => {
            const checkConnection = () => {
                this.status === StatusCode.LOGGED_OUT ?
                    resolve({})
                    : setTimeout(checkConnection, 1000);
            };
            checkConnection()
        })
        this.logout_callback && await this.logout_callback({
            clientId: this.clientId,
            status: this.status
        })
        return {
            clientId: this.clientId,
            status: this.status
        }
    }

    softLogout = async () => {
        this.status = StatusCode.SOFT_LOGOUT
        await this.sock.ws.close()
        this.logout_callback && await this.logout_callback({
            clientId: this.clientId,
            status: this.status
        })
    }
}