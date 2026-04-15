import { setUser } from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export function handlerLogin(cmdName: string, ...args: string[]): void {
    console.log("Logging in!");

    if (args.length === 0) {
        throw Error("No username given! Please try again!");
    }

    const username: string = args[0];
    setUser(username);
    console.log(`User ${username} has been set as logged in!`);
}
