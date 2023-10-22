import { Chat } from '../../Chat';
import { ExtendedContext } from '../../ExtendedContext';
import { InlineKeyboard } from 'grammy';
import { gameList } from '../bot';

export function getPlayingList(
    chatId: number
): { playing: boolean; id: number }[] | undefined {
    const chat = new Chat(chatId);
    const data = chat.getSessionData();
    if (!data) return undefined;
    const nearestGameId = gameList.nearestGameId();
    if (!nearestGameId) return undefined;
    if (!data.playing[nearestGameId]) return undefined;
    const playingList = data.playing[nearestGameId].users;
    return playingList;
}

export function getPlayingKeyboard(chatId: number): InlineKeyboard {
    const emptyKeyboard = new InlineKeyboard()
        .text(`👍`, 'PLAYING_BUTTON')
        .text(`👎`, 'NOT_PLAYING_BUTTON')
        .text('🫥', 'DONT_KNOW_BUTTON');

    const nearestGameId = gameList.nearestGameId();
    if (!nearestGameId) return emptyKeyboard;

    const chat = new Chat(chatId);

    const sessionData = chat.getSessionData();
    if (!sessionData?.playing[nearestGameId]) return emptyKeyboard;

    const playing =
        sessionData.playing[nearestGameId].users.reduce(
            (acc, user) => (acc += user.playing ? 1 : 0),
            0
        ) ?? 0;

    const notPlaying =
        sessionData.playing[nearestGameId].users.reduce(
            (acc, user) => (acc += user.playing ? 0 : 1),
            0
        ) ?? 0;

    if (!playing && !notPlaying) return emptyKeyboard;
    return new InlineKeyboard()
        .text(`${playing} 👍`, 'PLAYING_BUTTON')
        .text(`${notPlaying} 👎`, 'NOT_PLAYING_BUTTON')
        .text('🫥', 'DONT_KNOW_BUTTON');
}

export async function sendPlayingMessage(chatId: number, message: string) {
    const chat = new Chat(chatId);
    const nearestGameId = gameList.nearestGameId();
    if (!nearestGameId) return;
    const sessionData = chat.getSessionData();
    if (!sessionData?.playing[nearestGameId]) return;
    const playingList = sessionData.playing[nearestGameId].users;

    let users = await Promise.all(
        playingList.map(async (e) => {
            const user = await chat.getUser(e.id);
            return { ...user, playing: e.playing };
        })
    );
    let messageArray: string[] = [message.split('\n')[0]!];
    if (users.some((e) => e.playing)) messageArray.push('\nИграют:');
    const playingUsers = await Promise.all(
        users
            .filter((e) => e.playing)
            .map(async (e) => await chat.getUser(e.id))
    );
    messageArray.push(...playingUsers.map((e) => e.username ?? e.name));
    if (users.some((e) => !e.playing)) messageArray.push('\nНе играют:');
    const notPlayingUsers = await Promise.all(
        users
            .filter((e) => !e.playing)
            .map(async (e) => await chat.getUser(e.id))
    );
    messageArray.push(...notPlayingUsers.map((e) => e.username ?? e.name));

    chat.send(messageArray.join('\n'), {
        reply_markup: getPlayingKeyboard(chatId),
    });
}
