import { argv } from "node:process";
import { readConfig } from "./config";
import { handleReset, handlerLogin, handlerRegister, handleUsers } from "./handler";
import { CommandsRegistry, registerCommand, runCommand } from "./registry";

async function main() {
    console.log("Hello, world!");

    // setUser("Petrut");
    const registry: CommandsRegistry = {};
    await registerCommand(registry, "login", handlerLogin);
    await registerCommand(registry, "register", handlerRegister);
    await registerCommand(registry, "reset", handleReset);
    await registerCommand(registry, "users", handleUsers);

    let input: string = "";
    argv.forEach((val) => {
        input += val + " ";
    });
    await executeInput(input, registry);

    const config = await readConfig();
    console.log("currentUserName: " + config.currentUserName);
    console.log("dbUrl: " + config.dbUrl);

    process.exit(0);
}

export async function cleanInput(input: string): Promise<string[]> {
    input = input.trim();
    return input.toLowerCase().split(" ").filter(c => c !== "");
}

export async function executeInput(input: string, registry: CommandsRegistry): Promise<void> {
    let words = await cleanInput(input);

    const args = words.slice(2);
    if (words.length > 2 && args[0] in registry) {
        if (args[1] || (args[0] === "reset" || args[0]) === "users") {
            await runCommand(registry, args[0], args[1]);
        } else {
            throw Error(`Unknown argument ${words[3]} for command ${words[2]}`);
        }
    } else {
        throw Error("Unknown command");
    }
}

main();
