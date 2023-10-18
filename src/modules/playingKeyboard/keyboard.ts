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

export function getPlayingKeyboard(
    chatId: number,
    ctx?: ExtendedContext
): InlineKeyboard {
    let playing = 0;
    let notPlaying = 0;
    const emptyKeyboard = new InlineKeyboard()
        .text(`👍`, 'PLAYING_BUTTON')
        .text(`👎`, 'NOT_PLAYING_BUTTON')
        .text('🫥', 'DONT_KNOW_BUTTON');

    if (ctx) {
        const nearestGameId = gameList.nearestGameId();
        if (!nearestGameId) return emptyKeyboard;

        playing = ctx.session.playing[nearestGameId].users.reduce(
            (acc, user) => (acc += user.playing ? 1 : 0),
            0
        );
        notPlaying = ctx.session.playing[nearestGameId].users.reduce(
            (acc, user) => (acc += user.playing ? 0 : 1),
            0
        );
    } else {
        const playingList = getPlayingList(chatId);
        if (!playingList) return emptyKeyboard;

        playing = playingList.reduce(
            (acc, user) => (acc += user.playing ? 1 : 0),
            0
        );
        notPlaying = playingList.reduce(
            (acc, user) => (acc += user.playing ? 0 : 1),
            0
        );
    }
    if (!playing && !notPlaying) return emptyKeyboard;
    return new InlineKeyboard()
        .text(`${playing} 👍`, 'PLAYING_BUTTON')
        .text(`${notPlaying} 👎`, 'NOT_PLAYING_BUTTON')
        .text('🫥', 'DONT_KNOW_BUTTON');
}
