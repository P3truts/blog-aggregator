import { CommandHandler } from "./handler";

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler): void {
    registry[cmdName] = handler;
    //console.log(`Command ${handler} added to the registry under ${cmdName}.`);
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): void {
    if (cmdName in registry && args.length > 0) {
        console.log(`Running command ${cmdName}...`);
        registry[cmdName](cmdName, args[0]);
        console.log("Command completed!");
    } else {
        console.log(`Command ${cmdName} or argument ${args[0]} incorrect. Please try again!`);
    }
}
