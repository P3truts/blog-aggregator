import { CommandHandler } from "./handler";

export type CommandsRegistry = Record<string, CommandHandler>;

export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): Promise<void> {
    registry[cmdName] = handler;
    //console.log(`Command ${handler} added to the registry under ${cmdName}.`);
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    if (cmdName in registry) {
        console.log(`Running command ${cmdName}...`);
        await registry[cmdName](cmdName, ...args);
        console.log("Command completed!");
    } else {
        console.log(`Command ${cmdName} or argument ${args[0]} incorrect. Please try again!`);
    }
}
