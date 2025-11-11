import { findClosestIndexFolder } from "../utils/tools.js";
import path from "path";
import { loadFolder } from "../handler/folderLoader.js";
import questsConfig from "../config/questsConfig.js";
export async function loadQuests(questsConfigs) {
    const rootDir = findClosestIndexFolder();
    const questsFolder = path.join(rootDir, "quests");
    const quests = await loadFolder(questsFolder, { logger: false, shouldReturn: true, subFolders: true });
    quests.forEach(q => {
        questsConfigs.set(q.name, q);
    });
    console.log(`Quests loaded: ${questsConfigs.size}`);
}
export const sendToProcess = (message) => {
    if (typeof process.send === "function") {
        process.send(message);
    }
};
// @ts-ignore
export function proxyToUrl(proxy, protocol = questsConfig.proxyType) {
    const [host, port] = proxy.ip.split(":");
    const [username, password] = proxy.authentication.split(":");
    if (!host || !port || !username || !password) {
        throw new Error("Invalid proxy format");
    }
    return `${protocol}://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}`;
}
