import { readConfig, setUser } from "./config";
import { fetchFeed } from "./feed";
import { createFeed } from "./lib/db/queries/feeds";
import { createUser, getUserByName, truncateTable, getUsers } from "./lib/db/queries/users";
import { feed, user } from "./lib/db/schema";

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

export async function handlerReset(cmdName: string): Promise<void> {
    console.log(`Executing ${cmdName}!`);

    await truncateTable("users");
    console.log(`Table users has been reset!`);
}

export async function handlerUsers(cmdName: string) {
    console.log(`Executing ${cmdName}!`);
    const users = await getUsers();
    const config = await readConfig();

    for (const user of users) {
        if (user.name === config.currentUserName) {
            console.log("* " + user.name + " (current)");
            continue;
        }
        console.log("* " + user.name);
    }
}

export async function handlerAgg(cmdName: string) {
    console.log(`Executing ${cmdName}!`);
    const feedURL = "https://www.wagslane.dev/index.xml";
    const feed = await fetchFeed(feedURL);

    console.log(feed);
}

export async function handlerFeed(cmdName: string, name: string, url: string) {
    console.log(`Executing ${cmdName}!`);
    const config = await readConfig();
    const currentUser = await getUserByName(config.currentUserName);

    if (name === undefined || url === undefined) {
        throw Error("A feed name and url must be given!");
    }
    const feed = await createFeed(name, url, currentUser.id);
    console.log(`The feed ${feed.name} has been created by user ${currentUser.name}!`);
    printFeed(currentUser, feed);
}

async function isUserRegistered(username: string): Promise<boolean> {
    const user = await getUserByName(username);
    console.log(`isUserRegistered res: ${user}`);
    let isUser = user !== undefined ? true : false;
    console.log(`User ${username} register status: ${isUser}.`);
    return isUser;
}

function printFeed(user: user, feed: feed) {
    console.log("User fields: ");
    console.log(user);

    console.log("Feed fields: ");
    console.log(feed);
}

