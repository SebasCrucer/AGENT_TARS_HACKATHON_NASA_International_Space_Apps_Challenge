import { DataSource, DataSourceOptions } from "typeorm";
import AuthHandle from "./bottle/AuthHandle";
import StoreHandle, { StoreHandleOptions } from "./bottle/StoreHandle";
import DB from "./DB";
import { Auth } from "./entity/Auth";

class BaileysBottle {
  static instance = new BaileysBottle();

  private constructor() { }

  private createStore = async (
    ds: DataSource,
    storeName: string,
    options?: StoreHandleOptions
  ) => {
    var store = await ds.getRepository(Auth).findOne({
      where: { key: storeName },
    });
    if (!store)
      store = await ds.getRepository(Auth).save({
        key: storeName,
        value: Buffer.from(""),
        chats: [],
        contacts: [],
        groups: [],
        messageDics: [],
        presenceDics: [],
      });
    return {
      auth: new AuthHandle(ds, storeName),
      store: new StoreHandle(ds, store, options),
      _ds: ds,
    };
  };

  private deleteStore = async (ds: DataSource, storeName: string) => {
    const storeRepository = ds.getRepository(Auth);
    await storeRepository.delete({ key: storeName });
  };

  init = async (
    db: DataSourceOptions,
    options?: {
      debug?: boolean;
      sync?: boolean;
    }
  ): Promise<{
    createStore: (
      storeName?: string,
      storeOptions?: StoreHandleOptions
    ) => Promise<{ auth: AuthHandle; store: StoreHandle; _ds: DataSource }>;
    deleteStore: (
      storeName: string
    ) => Promise<void>;
  }> => ({
    createStore: async (...args: any[]) =>
      this.createStore.apply(null, [await DB.get(db, options), args[0], args[1]]),
    deleteStore: async (storeName: string) =>
      this.deleteStore(await DB.get(db, options), storeName)
  });
}

export const BBottle = BaileysBottle.instance;
