import fs from "fs";
import path from "path";
import os from "os";

export type Config = {
    dbUrl: string,
    currentUserName: string,
    dbConnString: string
}

export async function setUser(currentUserName: string): Promise<void> {
    const config = await readConfig();
    config.currentUserName = currentUserName;

    const configPath = await getConfigPath();
    console.log("configPath: " + configPath);
    try {
        fs.writeFileSync(configPath, JSON.stringify(config));
    } catch (error: any) {
        console.log("An error occurred in setUser: " + error.message);
    }
}

export async function readConfig(): Promise<Config> {
    const configPath = await getConfigPath();

    let jsonConfig = {};
    try {
        const configContent = fs.readFileSync(configPath, "utf-8");

        jsonConfig = JSON.parse(configContent);
    } catch (error: any) {
        console.log("An error occurred in readConfig: " + error.message);
    }

    return jsonConfig as Config;
}

async function getConfigPath(): Promise<string> {
    //const homeDir = process.cwd();
    const homeDir = os.homedir();

    return path.join(homeDir, "./.gatorconfig.json");
}
