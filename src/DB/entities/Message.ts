import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { Chat } from "./Chats";

@Entity({ name: 'messages' })
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'json' })
    interaction!: { 'ai': string; 'user': string };

    @Column({ type: 'numeric' })
    cost!: number;

    @CreateDateColumn({ type: 'timestamptz' })
    timestamp!: Date;

    @ManyToOne(() => Chat, chat => chat.messages)
    chat!: Chat;
}