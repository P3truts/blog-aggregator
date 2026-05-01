import { readConfig, setUser } from "./config";
import { fetchFeed } from "./feed";
import { createFeed, createFeedFollow, deleteFeedFollow, getFeedByUrl, getFeedFollowsForUser, getFeeds, getNextFeedToFetch, markFeedFetched } from "./lib/db/queries/feeds";
import { createUser, getUserByName, truncateTable, getUsers, getUserById } from "./lib/db/queries/users";
import { Feed, User } from "./lib/db/schema";

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

export async function handlerAgg(cmdName: string, time_between_reqs: string) {
    console.log(`Executing ${cmdName}!`);
    const parsedDuration = parseDuration(time_between_reqs);
    console.log(`Collecting feeds every ${time_between_reqs}`);

    scrapeFeeds().catch();

    const interval = setInterval(() => {
        scrapeFeeds().catch();
    }, parsedDuration);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("\nShutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });

    //const feedURL = "https://www.wagslane.dev/index.xml";
    //const feed = await fetchFeed(feedURL);
    //console.log(feed);
}

export async function handlerFeed(cmdName: string, user: User, name: string, url: string) {
    console.log(`Executing ${cmdName}!`);

    const feed = await createFeed(name, url, user.id);
    await createFeedFollow(feed.user_id, feed.id);
    console.log(`The feed ${feed.name} has been created by user ${user.name}!`);
    printFeed(user, feed);
}

export async function handlerFeeds(cmdName: string) {
    console.log(`Executing ${cmdName}!`);
    const feeds = await getFeeds();

    for (const feed of feeds) {
        console.log(feed.name);
        console.log(feed.url);
        const user = await getUserById(feed.user_id);
        console.log(user.name);
        console.log("=====");
    }
}

export async function handlerFollow(cmdName: string, user: User, url: string) {
    console.log(`Executing ${cmdName}!`);
    console.log(url);

    const feed = await getFeedByUrl(url);
    console.log(feed);
    const followData = await createFeedFollow(user.id, feed.id);
    console.log(followData);
}

export async function handlerFollowing(cmdName: string, user: User) {
    console.log(`Executing ${cmdName}!`);

    const feeds = await getFeedFollowsForUser(user.id);
    console.log(feeds);
}

export async function handlerUnfollow(cmdName: string, user: User, url: string) {
    console.log(`Executing ${cmdName}!`);
    console.log(url);

    const feed = await getFeedByUrl(url);
    console.log(feed);
    const deletedData = await deleteFeedFollow(user.id, feed.id);
    console.log(deletedData);
}

async function isUserRegistered(username: string): Promise<boolean> {
    const user = await getUserByName(username);
    console.log(`isUserRegistered res: ${user}`);
    let isUser = user !== undefined ? true : false;
    console.log(`User ${username} register status: ${isUser}.`);
    return isUser;
}

async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch();
    console.log("Next Feed:");
    console.log(nextFeed);

    const markedFeed = await markFeedFetched(nextFeed.id);
    console.log("Marked Feed:");
    console.log(markedFeed);

    const retrievedFeed = await fetchFeed(nextFeed.url);
    //console.log("Retrieved Feed:");
    //console.log(retrievedFeed);
    console.log("Marked Feed items: ");
    for (const item of retrievedFeed) {
        console.log(item);
    }
}

function printFeed(user: User, feed: Feed) {
    console.log("User fields: ");
    console.log(user);

    console.log("Feed fields: ");
    console.log(feed);
}

function parseDuration(durationStr: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    if (match && match[2]) {
        const num = parseInt(match[1]);
        if (isNaN(num)) {
            throw Error(`Duration ${durationStr} cannot be parsed. Try again!`);
        }
        if (match[2] === "ms") {
            return num;
        } else if (match[2] === "s") {
            return num * 1000;
        } else if (match[2] === "m") {
            return num * 60 * 1000;
        } else {
            return num * 60 * 60 * 1000;
        }
    } else {
        throw Error(`Duration ${durationStr} cannot be parsed. Try again!`);
    }
}

