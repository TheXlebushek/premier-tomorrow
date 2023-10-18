import * as fs from 'fs';

import { APP_DATA, SESSIONS_DATA, bot } from './modules/bot';
import { ExtendedContext, SessionData } from './ExtendedContext';
import {
    ForceReply,
    InlineKeyboardMarkup,
    MessageEntity,
    ParseMode,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
} from 'grammy/types';

import { Context } from 'grammy';

/**
 * Helps doing some Context action even if you don't have it
 */
export class Chat {
    private readonly chatId: number;
    constructor(private readonly ctx: ExtendedContext | number) {
        this.chatId = typeof ctx == 'number' ? ctx : ctx.chat?.id!;
    }

    /**
     * Sends message to the chat
     * @param message to be sent
     * @param other optional remaining parametera
     * @returns on success sent message is returned
     */
    send(
        message: string,
        other?: {
            reply_markup?:
                | InlineKeyboardMarkup
                | ReplyKeyboardMarkup
                | ReplyKeyboardRemove
                | ForceReply;
            disable_notification?: boolean;
            entities?: MessageEntity[];
            parse_mode?: ParseMode;
            reply_to_message_id?: number;
            protect_content?: boolean;
        }
    ) {
        return bot.api.sendMessage(this.chatId, message, other);
    }

    /**
     * Pins message or messages in the chat
     * @param messageId id of message of array of ids
     */
    pinMessage(messageId: number | number[]) {
        if (Array.isArray(messageId))
            messageId.forEach((e) => bot.api.pinChatMessage(this.chatId, e));
        else bot.api.pinChatMessage(this.chatId, messageId);
    }

    /**
     * Unpins message or messages from the chat
     * @param messageId id of message of array of ids
     */
    unpinMessage(messageId: number | number[]) {
        if (Array.isArray(messageId))
            messageId.forEach((e) => bot.api.unpinChatMessage(this.chatId, e));
        else bot.api.unpinChatMessage(this.chatId, messageId);
    }

    /**
     * Gets readonly session data
     * @returns session data (only if session key is the default one)
     */
    getSessionData(): SessionData | undefined {
        if (this.ctx instanceof Context) return this.ctx.session;
        const folder = `${APP_DATA}${SESSIONS_DATA}${
            Math.abs(this.ctx) % 100
        }/`;
        if (!fs.existsSync(`${folder}${this.ctx}.json`)) return undefined;
        const rawData = fs.readFileSync(`${folder}${this.ctx}.json`, 'utf-8');
        const data = JSON.parse(rawData) as SessionData;
        return data;
    }

    /**
     * Saves data to session
     * @param data what to save
     */
    setSessionData(data: SessionData) {
        if (this.ctx instanceof Context) {
            this.ctx.session = data;
            return;
        }
        const folder = `${APP_DATA}${SESSIONS_DATA}${
            Math.abs(this.ctx) % 100
        }/`;
        if (!fs.existsSync(`${folder}`)) fs.mkdirSync(`${folder}`);
        fs.writeFileSync(
            `${folder}/${this.ctx}.json`,
            JSON.stringify(data, null, 4)
        );
    }

    /**
     * Gets chat member by id
     * @param userId user id
     * @returns user as chat member
     */
    async getUser(userId: number): Promise<{
        name: string;
        username?: string;
        id: number;
        status:
            | 'member'
            | 'creator'
            | 'administrator'
            | 'restricted'
            | 'left'
            | 'kicked';
    }> {
        let user = await bot.api.getChatMember(this.chatId, userId);
        if (user.user.username) user.user.username = `@${user.user.username}`;
        if (user.user.last_name)
            user.user.first_name += ' ' + user.user.last_name;
        return {
            name: user.user.first_name,
            username: user.user.username,
            id: user.user.id,
            status: user.status,
        };
    }
}
