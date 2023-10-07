import { Entity, OneToMany, Column, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./Message";

@Entity({ name: 'chats' })
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    jid!: string;

    @OneToMany(() => Message, message => message.chat, { cascade: ["insert", "update", "remove", "soft-remove", "recover"] })
    messages!: Message[];
}