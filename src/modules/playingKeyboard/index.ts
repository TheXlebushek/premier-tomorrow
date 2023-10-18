import { bot, gameList } from '../bot';

import { Chat } from '../../Chat';
import { getPlayingKeyboard } from './keyboard';

console.log('Setting playingKeyboard');

bot.callbackQuery('PLAYING_BUTTON', async (ctx) => {
    const nearestGameId = gameList.nearestGameId();
    if (!nearestGameId) return;
    if (!ctx.session.playing[nearestGameId])
        ctx.session.playing[nearestGameId] = { users: [] };
    const playingList = ctx.session.playing[nearestGameId].users;
    let player = playingList.find((user) => user.id == ctx.from.id);
    if (!player) playingList.push({ id: ctx.from.id, playing: true });
    else player.playing = true;

    const chat = new Chat(ctx);

    let users = await Promise.all(
        playingList.map(async (e) => {
            const user = await chat.getUser(e.id);
            return { ...user, playing: e.playing };
        })
    );
    let message: string[] = [ctx.msg?.text?.split('\n')[0]!];
    if (users.some((e) => e.playing)) message.push('\nИграют:');
    const playingUsers = await Promise.all(
        users
            .filter((e) => e.playing)
            .map(async (e) => await chat.getUser(e.id))
    );
    message.push(...playingUsers.map((e) => e.username ?? e.name));
    if (users.some((e) => !e.playing)) message.push('\nНе играют:');
    const notPlayingUsers = await Promise.all(
        users
            .filter((e) => !e.playing)
            .map(async (e) => await chat.getUser(e.id))
    );
    message.push(...notPlayingUsers.map((e) => e.username ?? e.name));

    try {
        await ctx.editMessageText(message.join('\n'), {
            reply_markup: getPlayingKeyboard(ctx.chat?.id!, ctx),
        });
    } catch (error) {}
});

bot.callbackQuery('NOT_PLAYING_BUTTON', async (ctx) => {
    const nearestGameId = gameList.nearestGameId();
    if (!nearestGameId) return;
    if (!ctx.session.playing[nearestGameId])
        ctx.session.playing[nearestGameId] = { users: [] };
    const playingList = ctx.session.playing[nearestGameId].users;
    let player = playingList.find((user) => user.id == ctx.from.id);
    if (!player) playingList.push({ id: ctx.from.id, playing: false });
    else player.playing = false;

    const chat = new Chat(ctx);

    let users = await Promise.all(
        playingList.map(async (e) => {
            const user = await chat.getUser(e.id);
            return { ...user, playing: e.playing };
        })
    );
    let message: string[] = [ctx.msg?.text?.split('\n')[0]!];
    if (users.some((e) => e.playing)) message.push('\nИграют:');
    const playingUsers = await Promise.all(
        users
            .filter((e) => e.playing)
            .map(async (e) => await chat.getUser(e.id))
    );
    message.push(...playingUsers.map((e) => e.username ?? e.name));
    if (users.filter((e) => !e.playing).length) message.push('\nНе играют:');
    const notPlayingUsers = await Promise.all(
        users
            .filter((e) => !e.playing)
            .map(async (e) => await chat.getUser(e.id))
    );
    message.push(...notPlayingUsers.map((e) => e.username ?? e.name));

    try {
        await ctx.editMessageText(message.join('\n'), {
            reply_markup: getPlayingKeyboard(ctx.chat?.id!, ctx),
        });
    } catch (error) {}
});

bot.callbackQuery('DONT_KNOW_BUTTON', async (ctx) => {
    const nearestGameId = gameList.nearestGameId();
    if (!nearestGameId) return;
    if (!ctx.session.playing[nearestGameId])
        ctx.session.playing[nearestGameId] = { users: [] };
    let playingList = ctx.session.playing[nearestGameId].users;
    playingList = playingList.filter((user) => user.id != ctx.from.id);
    ctx.session.playing[nearestGameId].users = playingList;

    const chat = new Chat(ctx);

    let users = await Promise.all(
        playingList.map(async (e) => {
            const user = await chat.getUser(e.id);
            return { ...user, playing: e.playing };
        })
    );
    let message: string[] = [ctx.msg?.text?.split('\n')[0]!];
    if (users.some((e) => e.playing)) message.push('\nИграют:');
    const playingUsers = await Promise.all(
        users
            .filter((e) => e.playing)
            .map(async (e) => await chat.getUser(e.id))
    );
    message.push(...playingUsers.map((e) => e.username ?? e.name));
    if (users.some((e) => !e.playing)) message.push('\nНе играют:');
    const notPlayingUsers = await Promise.all(
        users
            .filter((e) => !e.playing)
            .map(async (e) => await chat.getUser(e.id))
    );
    message.push(...notPlayingUsers.map((e) => e.username ?? e.name));

    try {
        await ctx.editMessageText(message.join('\n'), {
            reply_markup: getPlayingKeyboard(ctx.chat?.id!, ctx),
        });
    } catch (error) {}
});
