import * as utils from '../utils';

import { bot, gameList } from './bot';

console.log('Setting messages');

bot.hears(
    ['Когда премьер?', 'когда премьер?', 'Когда премьер', 'когда премьер'],
    (ctx) => {
        const now = new Date();
        const nearestGame = gameList.getNearestGame();
        if (!nearestGame) {
            ctx.reply('Премьеров в ближайшее время не наблюдается', {
                reply_to_message_id: ctx.msg.message_id,
            });
            return;
        }
        const difference = nearestGame.date.getTime() - now.getTime();
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / (1000 * 60)) % 60);

        let replyString = '';
        if (hours > 3)
            replyString = `Ближайший премьер через ${hours} ${utils.num2Word(
                hours,
                'час',
                'часа',
                'часов'
            )}`;
        else if (hours == 0)
            replyString = `Ближайший премьер через ${minutes} ${utils.num2Word(
                minutes,
                'минуту',
                'минуты',
                'минут'
            )}`;
        else
            replyString = `Ближайший премьер через ${hours} ${utils.num2Word(
                hours,
                'час',
                'часа',
                'часов'
            )} ${minutes} ${utils.num2Word(
                minutes,
                'минуту',
                'минуты',
                'минут'
            )}`;
        ctx.reply(replyString, {
            reply_to_message_id: ctx.msg.message_id,
        });
    }
);

bot.on(':dice', async (ctx) => {
    const value = ctx.message?.dice.value;
    const emoji = ctx.message?.dice.emoji;

    const max = { '🏀': 5, '⚽': 5, '🎲': 6, '🎯': 6, '🎳': 6, '🎰': 64 }[
        emoji!
    ];

    await new Promise((r) => setTimeout(r, 3500));

    if (value == 1)
        ctx.reply(
            [
                'Зэ хант даз нот олвэйс гоу эс плэнд, даз ит?',
                `Иф йор нот э гуд шот тудэй, донт вори. Зэр арэ азэр вэйс ту би юсэфул.`,
            ].random(),
            { reply_to_message_id: ctx.msg.message_id }
        );
    else if (value == max)
        ctx.reply(
            ['Окей, зэт из дан.', 'Нау зыс из ворс сэлебрэйтинг!'].random(),
            { reply_to_message_id: ctx.msg.message_id }
        );

    // ('What do you say, drone. Ready to stretch your wings?');
    // ("We are strong because we are together. Don't forget that.");
    // ('Come, into the unknown!');
});
