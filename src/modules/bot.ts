import '../domainExpansion';
import 'dotenv/config';

import { Bot, session } from 'grammy';

import { ExtendedContext } from '../ExtendedContext';
import { FileAdapter } from '@grammyjs/storage-file';
import { GameList } from '../GameList';
import { Reminder } from '../Reminder';

console.log('Initializing bot');

export const VERSION = '1.2.22';
export const APP_DATA = 'appdata/';
export const SESSIONS_DATA = 'sessions/';
export const REMINDERS_FILE = 'reminders.json';
export const PREMIER_GAMES_FILE = 'premierGames2023.json';

export const gameList = new GameList();
export const reminder = new Reminder(APP_DATA, REMINDERS_FILE);

if (!process.env.BOT_TOKEN)
    throw new Error('You must specify BOT_TOKEN in .env file');
export const bot = new Bot<ExtendedContext>(process.env.BOT_TOKEN);

bot.use(
    session({
        initial: () => ({ playing: {}, pinnedMessages: [] }),
        // storage: enhanceStorage({
        storage: new FileAdapter({ dirName: APP_DATA + SESSIONS_DATA }),
        // migrations: {},
        // }),
        // getSessionKey: (ctx: Context) => {
        //     if (!ctx.chat) return undefined;
        //     return `${ctx.chat.id}`;
        // },
    })
);

bot.use(async (ctx, next) => {
    ctx.config = { isDeveloper: false };
    if (!process.env.DEVELOPER_ID)
        ctx.config = { isDeveloper: ctx.from?.id == process.env.DEVELOPER_ID };
    await next();
});
