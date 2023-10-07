import { proto } from "@whiskeysockets/baileys";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
} from "typeorm";
import { Auth } from "./Auth";

@Entity()
@Unique(["id"])
@Unique(["DBAuth"])
export class Chat {
  @PrimaryGeneratedColumn()
  DBId!: number;

  @ManyToOne(() => Auth, (auth) => auth.chats, { onDelete: "CASCADE" })
  DBAuth!: Auth;

  @Column()
  id!: string;

  @Column({ nullable: true, type: "simple-json" })
  messages?: proto.IHistorySyncMsg[] | null;

  @Column({ nullable: true, type: 'varchar' })
  newJid?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  oldJid?: string | null;

  @Column({ nullable: true, type: "simple-json" })
  lastMsgTimestamp?: number | Long | null;

  @Column({ nullable: true, type: 'numeric' })
  unreadCount?: number | null;

  @Column({ nullable: true, type: 'boolean' })
  readOnly?: boolean | null;

  @Column({ nullable: true, type: 'boolean' })
  endOfHistoryTransfer?: boolean | null;

  @Column({ nullable: true, type: 'numeric' })
  ephemeralExpiration?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  ephemeralSettingTimestamp?: number | Long | null;

  @Column({ nullable: true, type: "simple-json" })
  endOfHistoryTransferType?: proto.Conversation.EndOfHistoryTransferType | null;

  @Column({ nullable: true, type: "simple-json" })
  conversationTimestamp?: number | Long | null;

  @Column({ nullable: true, type: 'varchar' })
  name?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  pHash?: string | null;

  @Column({ nullable: true, type: 'boolean' })
  notSpam?: boolean | null;

  @Column({ nullable: true, type: 'boolean' })
  archived?: boolean | null;

  @Column({ nullable: true, type: "simple-json" })
  disappearingMode?: proto.IDisappearingMode | null;

  @Column({ nullable: true, type: 'numeric' })
  unreadMentionCount?: number | null;

  @Column({ nullable: true, type: 'boolean' })
  markedAsUnread?: boolean | null;

  @Column({ nullable: true, type: "simple-json" })
  participant?: proto.IGroupParticipant[] | null;

  @Column({ nullable: true, type: "simple-array" })
  tcToken?: Uint8Array | null;

  @Column({ nullable: true, type: "simple-json" })
  tcTokenTimestamp?: number | Long | null;

  @Column({ nullable: true, type: "simple-array" })
  contactPrimaryIdentityKey?: Uint8Array | null;

  @Column({ nullable: true, type: 'numeric' })
  pinned?: number | null;

  @Column({ nullable: true, type: "simple-json" })
  muteEndTime?: number | Long | null;

  @Column({ nullable: true, type: "simple-json" })
  wallpaper?: proto.IWallpaperSettings | null;

  @Column({ nullable: true, type: "integer" })
  mediaVisibility?: proto.MediaVisibility | null;

  @Column({ nullable: true, type: "simple-json" })
  tcTokenSenderTimestamp?: number | Long | null;

  @Column({ nullable: true, type: 'boolean' })
  suspended?: boolean | null;

  @Column({ nullable: true, type: 'boolean' })
  terminated?: boolean | null;

  @Column({ nullable: true, type: "simple-json" })
  createdAt?: number | Long | null;

  @Column({ nullable: true, type: 'varchar' })
  createdBy?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  description?: string | null;

  @Column({ nullable: true, type: 'boolean' })
  support?: boolean | null;

  @Column({ nullable: true, type: 'boolean' })
  isParentGroup?: boolean | null;

  @Column({ nullable: true, type: 'boolean' })
  isDefaultSubgroup?: boolean | null;

  @Column({ nullable: true, type: 'varchar' })
  parentGroupId?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  displayName?: string | null;

  @Column({ nullable: true, type: 'varchar' })
  pnJid?: string | null;

  @Column({ nullable: true, type: 'boolean' })
  selfMasked?: boolean | null;

  @Column({ nullable: true, type: 'numeric' })
  mute?: number | null;

  @Column({ nullable: true, type: "bigint" })
  pin?: number | null;

  @Column({ nullable: true, type: 'boolean' })
  archive?: boolean;
}
