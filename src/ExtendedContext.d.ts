import { Context, SessionFlavor } from 'grammy';

/**
 * adds .playing to session data
 */
export interface SessionData {
    playing: {
        [gameId: number]: {
            users: {
                playing: boolean;
                id: number;
            }[];
        };
    };
    pinnedMessages: number[];
}

/**
 * adds .config and session support
 */
export type ExtendedContext = Context &
    SessionFlavor<SessionData> & {
        config: { isDeveloper: boolean };
    };
