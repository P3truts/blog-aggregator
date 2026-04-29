import { User } from "./lib/db/schema";
import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";
import { CommandHandler } from "./handler";

export type UserCommandHandler = (cmdName: string, user: User, ...args: string[]) => Promise<void>;

async function getUser() {
    const config = await readConfig();
    const currentUser = await getUserByName(config.currentUserName);

    if (currentUser === undefined) {
        throw Error(`The user ${config.currentUserName} is not registered!`);
    }

    return currentUser;
}

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName: string, ...args: string[]) => {
        const currentUser = await getUser();
        await handler(cmdName, currentUser, ...args)
    };
};

