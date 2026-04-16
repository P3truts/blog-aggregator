import { setUser } from "./config";
import { createUser, getUserByName } from "./lib/db/queries/users";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
    console.log(`Executing ${cmdName}!`);

    if (args.length === 0) {
        throw Error("No username given! Please try again!");
    }

    const username: string = args[0];
    if (await isUserRegistered(username)) {
        await setUser(username);
    } else {
        throw Error(`The user ${username} is not registered! Please create an account!`);
    }
    console.log(`User ${username} has been set as logged in!`);
}

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
    console.log(`Executing ${cmdName}!`);

    if (args.length === 0) {
        throw Error("No username given! Please try again!");
    }

    const username: string = args[0];
    if (await isUserRegistered(username)) {
        throw Error(`The user ${username} is already registered!`);
    } else {
        const user = await createUser(username);
        console.log(`User ${user} has been registered!`);
    }
    setUser(username);
}

async function isUserRegistered(username: string): Promise<boolean> {
    const user = await getUserByName(username);
    console.log(`isUserRegistered res: ${user}`);
    let isUser = user !== undefined ? true : false;
    console.log(`User ${username} register status: ${isUser}.`);
    return isUser;
}
