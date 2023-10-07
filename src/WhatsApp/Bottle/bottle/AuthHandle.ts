import {
  AuthenticationCreds,
  AuthenticationState,
  BufferJSON,
  initAuthCreds,
  proto,
  SignalDataTypeMap,
} from "@whiskeysockets/baileys";
import { DataSource } from "typeorm";
import { Auth } from "../entity/Auth";

const KEY_MAP: { [T in keyof SignalDataTypeMap]: string } = {
  "pre-key": "preKeys",
  session: "sessions",
  "sender-key": "senderKeys",
  "app-state-sync-key": "appStateSyncKeys",
  "app-state-sync-version": "appStateVersions",
  "sender-key-memory": "senderKeyMemory",
};

import { Buffer } from 'buffer';

const jsonToBuffer = (jsonData: object): Buffer => {
  const jsonString = JSON.stringify(jsonData, BufferJSON.replacer, 2);

  const buffer = Buffer.from(jsonString, 'utf-8');

  return buffer;
};

export default class AuthHandle {
  constructor(private ds: DataSource, private key: string) { }
  private repos = {
    auth: this.ds.getRepository(Auth),
  };

  useAuthHandle = async (): Promise<{
    state: AuthenticationState;
    saveState: () => Promise<any>;
  }> => {
    let creds: AuthenticationCreds;
    let keys: any = {};

    var existingAuth = await this.repos.auth.findOneBy({
      key: this.key,
    });

    if (existingAuth) {
      const jsonString = existingAuth.value.toString('utf-8');
      let jsonData: { creds: AuthenticationCreds; keys: {} }
      if (jsonString) {
        jsonData = JSON.parse(jsonString, BufferJSON.reviver);
      } else {
        console.log('Initializing new credentials...');
        jsonData = { creds: initAuthCreds(), keys: {} };
      }
      ({ creds, keys } = jsonData);
    } else {
      console.log('Initializing new credentials...');
      creds = initAuthCreds();
    }

    const saveState = async () => {
      try {
        // console.log('Saving authentication state...');
        await this.repos.auth.upsert(
          {
            key: this.key,
            value: jsonToBuffer({ creds, keys }),
          },
          {
            conflictPaths: ["key"],
          }
        );
        // console.log('Authentication state saved successfully.');
      } catch (error) {
        console.log('Saving authentication state failed. Error: ' + error);
      }
    };

    return {
      state: {
        creds,
        keys: {
          get: (type: string, ids: any[]) => {
            const key = KEY_MAP[type as keyof typeof KEY_MAP];
            return ids.reduce((dict, id) => {
              let value = keys[key]?.[id];
              if (value) {
                if (type === "app-state-sync-key")
                  value = proto.Message.AppStateSyncKeyData.fromObject(value);
                dict[id] = value;
              }
              return dict;
            }, {});
          },
          set: async (data: { [x: string]: any; }) => {
            for (const _key in data) {
              const key = KEY_MAP[_key as keyof SignalDataTypeMap];
              keys[key] = keys[key] || {};
              Object.assign(keys[key], data[_key]);
            }

            await saveState();
          },
        },
      },
      saveState,
    };
  };
}
