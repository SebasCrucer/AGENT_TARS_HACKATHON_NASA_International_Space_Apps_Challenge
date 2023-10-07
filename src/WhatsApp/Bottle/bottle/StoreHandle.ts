import makeWASocket, {
  BaileysEventEmitter,
  ConnectionState,
  jidNormalizedUser,
  toNumber,
  updateMessageWithReceipt,
  updateMessageWithReaction,
  WAMessageKey,
  WAMessageCursor,
  Contact,
  WASocket,
} from "@whiskeysockets/baileys";
import { Chat as DBChat } from "../entity/Chat";
import { Contact as DBContact } from "../entity/Contact";
import { Message as DBMessage } from "../entity/Message";
import { MessageDic as DBMessageDic } from "../entity/MessageDic";
import { PresenceDic as DBPresenceDic } from "../entity/PresenceDic";
import { Presence as DBPresence } from "../entity/Presence";
import { GroupMetadata as DBGroupMetadata } from "../entity/GroupMetadata";
import { DataSource, In } from "typeorm";
import { Auth } from "../entity/Auth";

export interface StoreHandleOptions {
  disableDelete?: ("chats" | "messages")[];
}

export default class StoreHandle {
  socket!: ReturnType<typeof makeWASocket>;
  constructor(
    private ds: DataSource,
    private auth: Auth,
    private options?: StoreHandleOptions
  ) {
    this.options = {
      disableDelete: [],
      ...(this.options || {}),
    };
  }
  private repos = {
    contacts: this.ds.getRepository(DBContact),
    chats: this.ds.getRepository(DBChat),
    messageDics: this.ds.getRepository(DBMessageDic),
    messages: this.ds.getRepository(DBMessage),
    presenceDics: this.ds.getRepository(DBPresenceDic),
    groups: this.ds.getRepository(DBGroupMetadata),
  };

  state: ConnectionState = { connection: "close" };

  chats = {
    all: () =>
      this.repos.chats.findBy({
        DBAuth: {
          id: this.auth.id,
        },
      }),
    id: (id: string): Promise<DBChat | null> =>
      this.repos.chats.findOneBy({
        id,
        DBAuth: {
          id: this.auth.id,
        },
      })
  };

  contacts = {
    all: () =>
      this.repos.contacts.findBy({
        DBAuth: {
          id: this.auth.id,
        },
      }),
    id: (id: string): Promise<DBContact | null> =>
      this.repos.contacts.findOneBy({
        id,
        DBAuth: {
          id: this.auth.id,
        },
      }),
  };

  messages = {
    all: async (jid: string): Promise<DBMessage[] | undefined> =>
      (
        await this.repos.messageDics.findOne({
          where: {
            jid,
            DBAuth: {
              id: this.auth.id,
            },
          },
          relations: ["messages"],
        })
      )?.messages,
    id: async (jid: string, msgId: string): Promise<DBMessage | undefined> =>
      (
        await this.repos.messageDics.findOne({
          where: {
            jid,
            DBAuth: {
              id: this.auth.id,
            },
          },
          relations: ["messages"],
        })
      )?.messages.find((x) => x.msgId === msgId),
  };

  groupMetadata = {
    all: () =>
      this.repos.groups.findBy({
        DBAuth: {
          id: this.auth.id,
        },
      }),
    id: (id: string): Promise<DBGroupMetadata | null> =>
      this.repos.groups.findOneBy({
        id,
        DBAuth: {
          id: this.auth.id,
        },
      }),
  };

  presence = {
    all: async (id: string): Promise<DBPresence[] | undefined> =>
      (
        await this.repos.presenceDics.findOne({
          where: {
            id,
            DBAuth: {
              id: this.auth.id,
            },
          },
          relations: ["presences"],
        })
      )?.presences,
    id: async (
      id: string,
      participant: string
    ): Promise<DBPresence | undefined> =>
      (
        await this.repos.presenceDics.findOne({
          where: {
            id,
            DBAuth: {
              id: this.auth.id,
            },
          },
          relations: ["presences"],
        })
      )?.presences.find((x) => x.participant === participant),
  };

  //// EL ORIGINAL

  // private contactsUpsert = async (newContacts: Contact[]) => {
  //   var contacts = await this.repos.contacts.findBy({
  //     DBAuth: {
  //       id: this.auth.id,
  //     },
  //   });
  //   const oldContacts = new Set(Object.keys(contacts));
  //   for (const contact of newContacts) {
  //     oldContacts.delete(contact.id);
  //     contacts[contact.id] = Object.assign(
  //       contacts[contact.id] || ({ DBAuth: { id: this.auth.id } } as DBContact),
  //       contact
  //     );
  //   }

  //   await this.repos.contacts.save(contacts);
  //   return oldContacts;
  // };

  //// EL TIPADO

  // private contactsUpsert = async (newContacts: Contact[]) => {
  //   let contacts 
  //   contacts = await this.repos.contacts.findBy({
  //     DBAuth: {
  //       id: this.auth.id,
  //     },
  //   });
  //   const oldContacts = new Set(Object.keys(contacts));
  //   for (const contact of newContacts) {
  //     oldContacts.delete(contact.id);
  //     contacts[contact.id as keyof typeof contacts] = Object.assign(
  //       contacts[contact.id as keyof typeof contacts] || ({ DBAuth: { id: this.auth.id } } as DBContact),
  //       contact
  //     );
  //   }

  //   await this.repos.contacts.save(contacts);
  //   return oldContacts;
  // };

  //// EL DE CHATGPT

  private contactsUpsert = async (newContacts: Contact[]) => {
    let contacts: { [key: string]: DBContact } = {}; // Cambia el tipo a un objeto indexado

    const existingContacts = await this.repos.contacts.findBy({
      DBAuth: {
        id: this.auth.id,
      },
    });

    existingContacts.forEach((contact) => {
      contacts[contact.id] = contact; // Rellenar el objeto indexado con los contactos existentes
    });

    const oldContacts = new Set<string>(Object.keys(contacts));

    for (const contact of newContacts) {
      oldContacts.delete(contact.id);
      contacts[contact.id] = Object.assign(
        contacts[contact.id] || ({ DBAuth: { id: this.auth.id } } as DBContact),
        contact
      );
    }

    await this.repos.contacts.save(Object.values(contacts)); // Convertir el objeto indexado en un array antes de guardarlo
    return oldContacts;
  };

  private assertMessageList = async (jid: string) => {
    let list = await this.repos.messageDics.findOne({
      where: {
        jid,
        DBAuth: {
          id: this.auth.id,
        },
      },
      relations: ["messages"],
    })

    if (!list) {
      try {
        list = await this.repos.messageDics.save({
          jid,
          DBAuth: { id: this.auth.id },
          messages: [],
        })
      } catch (error) {
        if (this.socket.ws.isClosed) return
        console.log('Error mesage at geting assertMessageList: ' + error);
      }
    }

    return list
  }

  bind = (socket: ReturnType<typeof makeWASocket>) => {
    this.socket = socket
    socket.ev.on("connection.update", (update) => Object.assign(this.state, update));
    socket.ev.on(
      "messaging-history.set",
      async ({
        chats: newChats,
        contacts: newContacts,
        messages: newMessages,
        isLatest,
      }) => {
        try {
          isLatest &&
            (await Promise.all([
              async () =>
                await this.repos.messageDics.remove(
                  await this.repos.messageDics.findBy({
                    DBAuth: { id: this.auth.id },
                  })
                ),
              async () =>
                await this.repos.chats.remove(
                  await this.repos.chats.findBy({ DBAuth: { id: this.auth.id } })
                ),
            ]));

          const oldContacts = await this.contactsUpsert(newContacts);
          await this.repos.contacts.delete({
            id: In(Array.from(oldContacts)),
            DBAuth: { id: this.auth.id },
          });

          for (const msg of newMessages) {
            const jid = msg.key.remoteJid!,
              dictionary = await this.assertMessageList(jid);

            if (!dictionary) return;
            let message: DBMessage | undefined | {};
            message = dictionary.messages.find(
              (x) => x?.key?.id === msg.key.id
            )
            if (
              !message
            ) {
              try {
                await this.repos.messages.save({
                  ...(msg as any),
                  msgId: msg.key?.id,
                  dictionary,
                });
                continue
              } catch (error) {
                if (this.socket.ws.isClosed) return
                console.log('Error mesage at messaging-history.set: ' + error);
              }
            }
            try {
              if (!message) message = {};
              Object.assign(message, msg);
            } catch (error) {
              if (this.socket.ws.isClosed) return
              console.log('Error Object.assing at messaging-history.set: ' + error);

            }
            try {
              await this.repos.messageDics.save(dictionary);
            } catch (error) {
              if (this.socket.ws.isClosed) return
              console.log('Error mesagedic at messaging-history.set: ' + error);

            }
          }
        } catch (error) {
          if (this.socket.ws.isClosed) return
          console.log('Error at messaging-history.set: ' + error);
        }
      }
    );
    socket.ev.on("contacts.update", async (updates) => {
      for (const update of updates) {
        try {
          let contact: DBContact | null;
          if (
            (contact = await this.repos.contacts.findOneBy({
              id: update.id!,
              DBAuth: { id: this.auth.id },
            }))
          ) {
            Object.assign(contact, update);
            await this.repos.contacts.save(contact);
          }
        } catch (error) {
          if (this.socket.ws.isClosed) return
          console.log('Error at contacts.update: ' + error);
        }
      }
    });
    socket.ev.on("chats.upsert", (newChats) => {
      try {
        newChats.forEach(async (chat) => {
          try {
            await this.repos.chats.upsert(
              { ...chat, DBAuth: { id: this.auth.id } },
              {
                conflictPaths: ["id", "DBAuth"],
              }
            );
          } catch (error) {
            if (this.socket.ws.isClosed) return
            console.log('Error at chats.upsert: ' + error);
          }
        });
      } catch { }
    });
    socket.ev.on("chats.update", async (updates) => {
      for (let update of updates) {
        try {
          var chat = await this.repos.chats.findOneBy({
            id: update.id!,
            DBAuth: { id: this.auth.id },
          });
          if (!chat) return;
          if (update.unreadCount! > 0) {
            update = { ...update };
            update.unreadCount = (chat.unreadCount || 0) + update.unreadCount!;
          }

          Object.assign(chat, update);
          await this.repos.chats.save(chat);
        } catch (error) {
          if (this.socket.ws.isClosed) return
          console.log('Error at chats.update: ' + error);

        }
      }
    });
    socket.ev.on("presence.update", async ({ id, presences: update }) => {
      try {
        var chat =
          (await this.repos.presenceDics.findOne({
            where: {
              id,
              DBAuth: { id: this.auth.id },
            },
            relations: ["presences"],
          })) ||
          ({
            id,
            presences: [],
            DBAuth: { id: this.auth.id },
          } as unknown as DBPresenceDic);

        Object.entries(update).forEach(([id, presence]) => {
          var participant = chat.presences.find((x) => x.participant === id);
          participant
            ? Object.assign(participant, presence)
            : chat.presences.push({
              ...presence,
              participant: id,
            } as any);
        });
        await this.repos.presenceDics.save(chat);
      } catch { }
    });
    socket.ev.on(
      "chats.delete",
      async (deletions) => {
        try {
          !this.options?.disableDelete?.includes("chats") &&
            Promise.all(
              deletions.map((id) =>
                this.repos.chats.delete({
                  id,
                  DBAuth: { id: this.auth.id },
                })
              )
            )
        } catch (error) {
          if (this.socket.ws.isClosed) return
          console.log('Error at chats.delete: ' + error);
        }
      }
    );
    socket.ev.on("messages.upsert", async ({ messages: newMessages, type }) => {
      switch (type) {
        case "append":
        case "notify":
          for (const msg of newMessages) {
            try {
              const jid = jidNormalizedUser(msg.key.remoteJid!);

              var dictionary = await this.assertMessageList(jid);
              if (!dictionary) return;
              let message: DBMessage | undefined;
              if (
                !(message = dictionary.messages.find(
                  (x) => x?.key?.id === msg.key.id
                ))
              ) {
                try {
                  return await this.repos.messages.save({
                    ...(msg as any),
                    msgId: msg.key?.id,
                    dictionary,
                  });
                } catch (error) {
                  if (this.socket.ws.isClosed) return
                  console.log('Error mesage at messages.upsert: ' + error);
                }
              }
              Object.assign(message || {}, msg);
              await this.repos.messageDics.save(dictionary);
              type === "notify" &&
                !(await this.repos.chats.findOneBy({
                  id: jid,
                  DBAuth: { id: this.auth.id },
                })) &&
                !socket.ws.isClosed && socket.ev.emit("chats.upsert", [
                  {
                    id: jid,
                    conversationTimestamp: toNumber(msg.messageTimestamp),
                    unreadCount: 1,
                  },
                ]);
            } catch (error) {
              if (this.socket.ws.isClosed) return
              console.log('Error at messages.upsert: ' + error);
            }
          }
          break;
      }
    });
    socket.ev.on("messages.update", async (updates) => {
      for (const { update, key } of updates) {
        try {
          var dictionary = await this.assertMessageList(key.remoteJid!);
          if (!dictionary) return;
          let message: DBMessage | undefined;
          if (!(message = dictionary.messages.find((x) => x?.key?.id === key.id)))
            continue;
          Object.assign(message, update);
          await this.repos.messageDics.save(dictionary);
        } catch (error) {
          if (this.socket.ws.isClosed) return
          console.log('Error at messages.update: ' + error);
        }
      }
    });
    socket.ev.on("messages.delete", async (item) => {
      try {
        if (this.options?.disableDelete?.includes("messages")) return;
        if ("all" in item) {
          const dictionary = await this.repos.messageDics.findOne({
            where: {
              jid: item.jid,
              DBAuth: { id: this.auth.id },
            },
            relations: ["messages"],
          });
          if (!dictionary) return;
          this.repos.messages.remove(dictionary.messages);
        } else {
          const jid = item.keys[0].remoteJid!;
          const dictionary = await this.repos.messageDics.findOne({
            where: {
              jid,
              DBAuth: { id: this.auth.id },
            },
            relations: ["messages"],
          });
          if (!dictionary) return;
          const idSet = new Set(item.keys.map((k) => k.id));
          await this.repos.messages.remove(
            dictionary.messages.filter((msg) =>
              Array.from(idSet).includes(msg.msgId)
            )
          );
        }
      } catch (error) {
        if (this.socket.ws.isClosed) return
        console.log('Error at messages.delete: ' + error);
      }
    });

    socket.ev.on("groups.update", async (updates) => {
      try {
        for (const update of updates) {
          const id = update.id!;
          let group = await this.repos.groups.findOneBy({
            id,
            DBAuth: { id: this.auth.id },
          });
          if (!group) return;
          Object.assign(group, update);
          await this.repos.groups.save(group);
        }
      } catch (error) {
        if (this.socket.ws.isClosed) return
        console.log('Error at groups.update: ' + error);
      }
    });

    socket.ev.on("group-participants.update", async ({ id, participants, action }) => {
      try {
        const metadata = await this.repos.groups.findOneBy({
          id,
          DBAuth: { id: this.auth.id },
        });
        if (!metadata) return;
        switch (action) {
          case "add":
            metadata.participants.push(
              ...participants.map((id) => ({
                id,
                isAdmin: false,
                isSuperAdmin: false,
              }))
            );
            break;
          case "demote":
          case "promote":
            metadata.participants.forEach(
              (participant) =>
                participants.includes(participant.id) &&
                (participant.isAdmin = action === "promote")
            );
            break;
          case "remove":
            metadata.participants = metadata.participants.filter(
              (p) => !participants.includes(p.id)
            );
            break;
        }
        await this.repos.groups.save(metadata);
      } catch (error) {
        if (this.socket.ws.isClosed) return
        console.log('Error at group-participant.update: ' + error);
      }
    });

    socket.ev.on("message-receipt.update", async (updates) => {
      for (const { key, receipt } of updates) {
        try {
          const dictionary = await this.repos.messageDics.findOne({
            where: {
              jid: key.remoteJid!,
              DBAuth: { id: this.auth.id },
            },
            relations: ["messages"],
          });
          if (!dictionary) return;
          const msg = dictionary.messages.find((x) => x?.key?.id === key.id!);
          if (!msg) continue;
          updateMessageWithReceipt(msg, receipt);
          await this.repos.messageDics.save(dictionary);
        } catch (error) {
          if (this.socket.ws.isClosed) return
          console.log('Error at messages.receipt.update: ' + error);
        }
      }
    });

    socket.ev.on("messages.reaction", async (reactions) => {
      for (const { key, reaction } of reactions) {
        try {
          const dictionary = await this.repos.messageDics.findOne({
            where: {
              jid: key.remoteJid!,
              DBAuth: { id: this.auth.id },
            },
            relations: ["messages"],
          });
          if (!dictionary) return;
          const msg = dictionary.messages.find((x) => x?.key?.id === key.id!);
          if (!msg) continue;
          updateMessageWithReaction(msg, reaction);
          await this.repos.messageDics.save(dictionary);
        } catch (error) {
          if (this.socket.ws.isClosed) return
          console.log('Error at messages.reaction: ' + error);
        }
      }
    });
  };

  loadMessages = async (
    jid: string,
    count: number,
    cursor: WAMessageCursor
  ): Promise<DBMessage[] | undefined> => {
    const dictionary = await this.assertMessageList(jid)
    if (!dictionary) return;
    const mode = !cursor || "before" in cursor ? "before" : "after"
    const cursorKey = !!cursor
      ? "before" in cursor
        ? cursor.before
        : cursor.after
      : undefined
    const cursorValue = cursorKey
      ? dictionary.messages.find((x) => x.msgId === cursorKey.id!)
      : undefined;

    let messages: DBMessage[];
    if (dictionary && mode === "before" && (!cursorKey || cursorValue)) {
      if (cursorValue) {
        const msgIdx = dictionary.messages.findIndex(
          (m) => m?.key?.id === cursorKey?.id
        );
        messages = dictionary.messages.slice(0, msgIdx);
      } else messages = dictionary.messages;

      const diff = count - messages.length;
      diff < 0 && (messages = messages.slice(-count));
    } else {
      messages = [];
    }

    return messages;
  };

  loadMessage = async (
    jid: string,
    id: string
  ): Promise<DBMessage | undefined> =>
    (
      await this.repos.messageDics.findOne({
        where: {
          jid,
          DBAuth: { id: this.auth.id },
        },
        relations: ["messages"],
      })
    )?.messages.find((x) => x.msgId === id);

  mostRecentMessage = async (jid: string): Promise<DBMessage | undefined> =>
    (
      await this.repos.messageDics.findOne({
        where: {
          jid,
          DBAuth: { id: this.auth.id },
        },
        relations: ["messages"],
      })
    )?.messages.slice(-1)[0];

  fetchImageUrl = async (
    jid: string,
    sock: WASocket | undefined
  ): Promise<string> => {
    const contact = await this.repos.contacts.findOne({ where: { id: jid } });
    if (!contact) return sock?.profilePictureUrl(jid) as unknown as string;
    if (typeof contact.imgUrl === "undefined")
      await this.repos.contacts.save({
        ...contact,
        imgUrl: await sock?.profilePictureUrl(jid),
      });
    return contact.imgUrl as unknown as string;
  };

  fetchGroupMetadata = async (
    jid: string,
    sock: WASocket | undefined
  ): Promise<DBGroupMetadata | undefined> => {
    var group = await this.repos.groups.findOneBy({
      id: jid,
      DBAuth: { id: this.auth.id },
    });
    if (!group) {
      const metadata = await sock?.groupMetadata(jid);
      metadata &&
        (group = await this.repos.groups.save({
          ...metadata,
          DBAuth: { id: this.auth.id },
        }));
    }

    return group || undefined;
  };

  fetchMessageReceipts = async ({
    remoteJid,
    id,
  }: WAMessageKey): Promise<DBMessage["userReceipt"] | undefined> => {
    const dictionary = await this.repos.messageDics.findOne({
      where: {
        jid: remoteJid!,
        DBAuth: { id: this.auth.id },
      },
      relations: ["messages"],
    });
    const msg = dictionary?.messages.find((x) => x.msgId === id);
    return msg?.userReceipt;
  };
}
