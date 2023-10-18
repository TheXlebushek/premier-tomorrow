import 'dotenv/config';
import './modules/commands';
import './modules/messages';
import './modules/playingKeyboard';

import { bot } from './modules/bot';

// import './modules/test';



bot.start().then(() => console.log(`@${bot.botInfo.username} is running...`));
