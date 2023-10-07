import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Chat } from "./Chat";
import { Contact } from "./Contact";
import { GroupMetadata } from "./GroupMetadata";
import { MessageDic } from "./MessageDic";
import { PresenceDic } from "./PresenceDic";

@Entity()
@Unique(["key"])
export class Auth {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  key!: string;

  @Column({ type: "bytea" })
  value!: Buffer;

  @OneToMany(() => Chat, (chat) => chat.DBAuth, { cascade: ["insert", "update", "remove", "soft-remove", "recover"] })
  chats!: Chat[];

  @OneToMany(() => Contact, (contact) => contact.DBAuth, { cascade: ["insert", "update", "remove", "soft-remove", "recover"] })
  contacts!: Contact[];

  @OneToMany(() => GroupMetadata, (group) => group.DBAuth, { cascade: ["insert", "update", "remove", "soft-remove", "recover"] })
  groups!: GroupMetadata[];

  @OneToMany(() => MessageDic, (messageDic) => messageDic.DBAuth, { cascade: ["insert", "update", "remove", "soft-remove", "recover"] })
  messageDics!: MessageDic[];

  @OneToMany(() => PresenceDic, (presenceDic) => presenceDic.DBAuth, { cascade: ["insert", "update", "remove", "soft-remove", "recover"] })
  presenceDics!: PresenceDic[];
}
