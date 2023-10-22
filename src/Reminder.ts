import * as fs from 'fs';

import {
    getPlayingKeyboard,
    getPlayingList,
} from './modules/playingKeyboard/keyboard';

import { Chat } from './Chat';
import { gameList } from './modules/bot';

export class Reminder {
    constructor(folder: string, file: string) {
        this.path = folder + file;
        if (!fs.existsSync(folder)) fs.mkdirSync(folder);
        if (!fs.existsSync(this.path))
            fs.writeFileSync(this.path, JSON.stringify([]), 'utf-8');
        const fileData = fs.readFileSync(this.path, 'utf-8');
        if (!fileData) return;
        const remindersData = JSON.parse(fileData) as number[];
        remindersData.forEach((chatId) => {
            this.addChatToReminders(chatId);
        });

        setInterval(async () => {
            const timeBeforeGame = gameList.msToNearestGame();
            if (!timeBeforeGame) return;
            const hours = Math.floor(timeBeforeGame / (1000 * 60 * 60));
            const minutes = Math.floor((timeBeforeGame / (1000 * 60)) % 60);
            let replyString = '';
            let shoudVote = false;
            if (hours == 23 && minutes == 59) {
                replyString = `Мужики, премьер через 24 часа. Играем?`;
                shoudVote = true;
            } else if (hours == 4 && minutes == 59)
                replyString = `Мужики, премьер через 5 часов`;
            else if (hours == 0 && minutes == 59)
                replyString = `Мужики, премьер через час`;
            else if (hours == 0 && minutes == 4)
                replyString = `Мужики, премьер через 5 минут`;
            if (!replyString) return;
            this.get().forEach(async (chatId) => {
                const upvotes = getPlayingList(chatId)?.reduce(
                    (acc, user) => (acc += user.playing ? 1 : 0),
                    0
                );
                const chat = new Chat(chatId);
                if (shoudVote) {
                    const msg = await chat.send(replyString, {
                        reply_markup: getPlayingKeyboard(chatId),
                    });
                    chat.pinMessage(msg.message_id);
                    let data = chat.getSessionData();
                    if (!data) return;
                    if (!data.pinnedMessages) data.pinnedMessages = [];
                    chat.unpinMessage(data.pinnedMessages);
                    data.pinnedMessages = [msg.message_id];
                    chat.setSessionData(data);
                } else if (upvotes && upvotes >= 5) chat.send(replyString);
            });
        }, 60 * 1000);
    }

    addChatToReminders(chatId: number): boolean {
        if (this.remindChatIds.has(chatId)) return false;
        this.remindChatIds.push(chatId);
        const serializedData = JSON.stringify(this.remindChatIds);
        fs.writeFileSync(this.path, serializedData, 'utf-8');
        return true;
    }

    removeChatFromReminder(chatId: number): boolean {
        if (!this.remindChatIds.has(chatId)) return false;
        this.remindChatIds = this.remindChatIds.filter((e) => e != chatId);
        const serializedData = JSON.stringify(this.remindChatIds);
        fs.writeFileSync(this.path, serializedData, 'utf-8');
        return true;
    }

    get(): number[] {
        return this.remindChatIds;
    }

    private path: string;

    private remindChatIds: number[] = [];
}
