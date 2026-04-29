import { argv } from "node:process";
//import { readConfig } from "./config";
import { handlerReset, handlerLogin, handlerRegister, handlerUsers, handlerAgg, handlerFeed, handlerFeeds, handlerFollow, handlerFollowing } from "./handler";
import { CommandsRegistry, registerCommand, runCommand } from "./registry";
import { middlewareLoggedIn } from "./middleware";

async function main() {
    console.log("Hello, world!");

    // setUser("Petrut");
    const registry: CommandsRegistry = {};
    await registerCommand(registry, "login", handlerLogin);
    await registerCommand(registry, "register", handlerRegister);
    await registerCommand(registry, "reset", handlerReset);
    await registerCommand(registry, "users", handlerUsers);
    await registerCommand(registry, "agg", handlerAgg);
    await registerCommand(registry, "addfeed", middlewareLoggedIn(handlerFeed));
    await registerCommand(registry, "feeds", handlerFeeds);
    await registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
    await registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));

    let input: string[] = [];
    argv.forEach((val) => {
        input.push(val);
    });
    await executeInput(input, registry);

    //const config = await readConfig();
    //console.log("currentUserName: " + config.currentUserName);
    //console.log("dbUrl: " + config.dbUrl);

    process.exit(0);
}

export async function cleanInput(input: string[]): Promise<string[]> {
    let cleanedInput: string[] = [];
    for (const inp of input) {
        let trimmedInp = inp.valueOf().trim();
        cleanedInput.push(trimmedInp);
    }

    return cleanedInput.slice(2);
}

export async function executeInput(input: string[], registry: CommandsRegistry): Promise<void> {
    const args = await cleanInput(input);

    if (args[0] in registry) {
        const cmdArgs = args.slice(1);
        await runCommand(registry, args[0], ...cmdArgs);
    } else {
        throw Error("Unknown command");
    }
}

main();
