import fs from "fs";
import path from "path";

export type Config = {
    dbUrl: string,
    currentUserName: string
}

export function setUser(currentUserName: string): void {
    const config = readConfig();
    config.currentUserName = currentUserName;

    const configPath = getConfigPath();
    //console.log("configPath: " + configPath);
    try {
        fs.writeFileSync(configPath, JSON.stringify(config));
    } catch (error: any) {
        console.log("An error occurred in setUser: " + error.message);
    }
}

export function readConfig(): Config {
    const configPath = getConfigPath();

    let jsonConfig = {};
    try {
        const configContent = fs.readFileSync(configPath, "utf-8");

        jsonConfig = JSON.parse(configContent);
    } catch (error: any) {
        console.log("An error occurred in readConfig: " + error.message);
    }

    return jsonConfig as Config;
}

function getConfigPath(): string {
    const homeDir = process.cwd();

    return path.join(homeDir, "./.gatorconfig.json");
}
