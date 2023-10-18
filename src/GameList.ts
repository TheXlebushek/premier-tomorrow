import * as fs from 'fs';

import { APP_DATA, PREMIER_GAMES_FILE, REMINDERS_FILE } from './modules/bot';

export type Game = { date: Date; map: string };

export class GameList {
    constructor() {
        this.gameDates = JSON.parse(
            fs.readFileSync(APP_DATA + PREMIER_GAMES_FILE, 'utf-8')
        ) as Game[];
        this.gameDates.forEach((e) => (e.date = new Date(e.date)));
    }

    /**
     *
     * @returns miliseconds till the nearest game if exists
     */
    msToNearestGame(): number | undefined {
        const now = new Date();
        const nearestGame = this.gameDates.find((game) => game.date > now);
        if (!nearestGame) return undefined;
        return nearestGame.date.getTime() - now.getTime();
    }

    /**
     *
     * @returns nearest game
     */
    getNearestGame(): Game | undefined {
        const now = new Date();
        return this.gameDates.find((game) => game.date > now);
    }

    /**
     *
     * @returns list of all games
     */
    get(): Game[] {
        return this.gameDates;
    }

    /**
     *
     * @returns nearest game id (time since epoch)
     */
    nearestGameId(): number | undefined {
        return this.getNearestGame()?.date.getTime();
    }

    private gameDates: Game[];
}
