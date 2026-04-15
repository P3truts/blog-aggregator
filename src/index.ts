import { argv } from "node:process";
import { readConfig, setUser } from "./config";
import { handlerLogin } from "./handler";
import { CommandsRegistry, registerCommand, runCommand } from "./registry";

function main() {
    console.log("Hello, world!");

    // setUser("Petrut");
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);

    let input: string = "";
    argv.forEach((val) => {
        input += val + " ";
    });
    executeInput(input, registry);

    const config = readConfig();
    console.log("currentUserName: " + config.currentUserName);
    console.log("dbUrl: " + config.dbUrl);
}

export function cleanInput(input: string): string[] {
    input = input.trim();
    return input.toLowerCase().split(" ").filter(c => c !== "");
}

export function executeInput(input: string, registry: CommandsRegistry): void {
    let words = cleanInput(input);

    const args = words.slice(2);
    if (words.length > 2 && args[0] in registry) {
        if (args[1]) {
            runCommand(registry, args[0], args[1]);
        } else {
            throw Error(`Unknown argument ${words[3]} for command ${words[2]}`);
        }
    } else {
        throw Error("Unknown command");
    }
}

main();
