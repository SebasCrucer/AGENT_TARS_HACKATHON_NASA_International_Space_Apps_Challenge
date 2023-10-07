import { GroupParticipant } from "@whiskeysockets/baileys";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Auth } from "./Auth";

@Entity()
@Unique(["DBId"])
export class GroupMetadata {
  @PrimaryGeneratedColumn()
  DBId!: number;

  @ManyToOne(() => Auth, (auth) => auth.chats, { onDelete: "CASCADE" })
  DBAuth!: Auth;

  @Column()
  id!: string;

  @Column({ nullable: true, type: 'varchar' })
  owner: string | undefined;

  @Column({ type: 'varchar' })
  subject!: string;

  @Column({ nullable: true, type: 'varchar' })
  subjectOwner?: string;

  @Column({ nullable: true, type: 'numeric' })
  subjectTime?: number;

  @Column({ nullable: true, type: 'numeric' })
  creation?: number;

  @Column({ nullable: true, type: 'varchar' })
  desc?: string;

  @Column({ nullable: true, type: 'varchar' })
  descOwner?: string;

  @Column({ nullable: true, type: 'varchar' })
  descId?: string;

  @Column({ nullable: true, type: 'boolean' })
  restrict?: boolean;

  @Column({ nullable: true, type: 'boolean' })
  announce?: boolean;

  @Column({ nullable: true, type: 'numeric' })
  size?: number;

  @Column({ nullable: true, type: "simple-json" })
  participants!: GroupParticipant[];

  @Column({ nullable: true, type: 'numeric' })
  ephemeralDuration?: number;

  @Column({ nullable: true, type: 'varchar' })
  inviteCode?: string;
}
