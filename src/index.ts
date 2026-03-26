import { readConfig, setUser } from "./config";

function main() {
    console.log("Hello, world!");

    setUser("Petrut");
    const config = readConfig();
    console.log("currentUserName: " + config.currentUserName);
    console.log("dbUrl: " + config.dbUrl);
}

main();
