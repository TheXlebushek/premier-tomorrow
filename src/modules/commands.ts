import { VERSION, bot, gameList, reminder } from './bot';

console.log('Setting commands');

bot.command('start', (ctx) => ctx.reply('Хэло'));

bot.command('help', (ctx) => {
    let help = '';
    help += '/help - это сообщение\n';
    help += '/schedule - расписание игр\n';
    help += '/info [keys] - информация для дебага\n';
    help += '/setupReminder - включить напоминания о ближайшем премьере\n';
    help += '/removeReminder - выключить напоминания о ближайшем премьере\n';
    help += '\n';
    help += 'Так же ты можешь спросить у меня когда премьер\n';
    help += 'А еще ты можешь кинуть кубик. Держи: 🎲\n';
    ctx.reply(help, { reply_to_message_id: ctx.msg.message_id });
});

bot.command('info', async (ctx) => {
    let args: string[] = ctx.message?.text.split(' ')!;
    args.shift();
    if (!args.length) args = ['userId', 'chatId', 'bot', 'version'];
    let info = '';
    let error = '';
    let usedArgs: string[] = [];
    for (const key of args) {
        if (usedArgs.has(key)) continue;
        switch (key) {
            case 'userId':
                info += `User id: ${ctx.from?.id}\n`;
                break;
            case 'chatId':
                info += `Chat id: ${ctx.chat.id}\n`;
                break;
            case key.match(/bot/)?.input:
                if (!ctx.config.isDeveloper) break;
                info += `Bot: ${JSON.stringify(
                    await bot.api.getMe(),
                    null,
                    2
                )}\n`;
                break;
            case 'version':
                info += `Version: ${VERSION}\n`;
                break;
            default:
                error += `"${key}", `;
                break;
        }
        usedArgs.push(key);
    }
    if (error) error = '[Error]: Could not resolve ' + error;
    ctx.reply(info + error, { reply_to_message_id: ctx.msg.message_id });
});

bot.command('schedule', (ctx) => {
    let schedule = '';
    let now = new Date();
    gameList.get().forEach((game) => {
        schedule += game.date < now ? '<s>' : '';
        schedule += `${game.date.toNormalString()} - ${game.map}`;
        schedule += game.date < now ? '</s>' : '';
        schedule += '\n';
    });
    ctx.reply(schedule, {
        reply_to_message_id: ctx.msg.message_id,
        parse_mode: 'HTML',
    });
});

bot.command('setupReminder', (ctx) => {
    let replyString = 'Напоминания уже включены';
    if (reminder.addChatToReminders(ctx.chat.id))
        replyString = 'Напоминания успешно включены';
    ctx.reply(replyString, {
        reply_to_message_id: ctx.msg.message_id,
    });
});

bot.command('removeReminder', (ctx) => {
    let replyString = 'Нечего удалять';
    if (reminder.removeChatFromReminder(ctx.chat.id))
        replyString = 'Напоминания отключены';
    ctx.reply(replyString, { reply_to_message_id: ctx.msg.message_id });
});

bot.command('remindersList', (ctx) => {
    ctx.reply(JSON.stringify(reminder.get()));
});

bot.hears(['Привет', 'привет', 'Hello', 'hello', 'Хэло', 'хэло'], (ctx) =>
    ctx.reply('Хэло')
);
