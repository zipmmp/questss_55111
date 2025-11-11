// caches
import GuildDocument from "../entities/guildSettings.js";
import ImageEntity from "../entities/image.js";
import QuestEntity from "../entities/quests.js";
import UserDocument from "../entities/userSettings.js";
import { AppDataSource } from "../index.js";
import { customCollection } from "../lib/quest/handler/customCollection.js";
export const usersCache = new customCollection();
export const questsCache = new customCollection();
export const guildSettingsRepo = AppDataSource.getRepo(GuildDocument);
export const userSettingsRepo = AppDataSource.getRepo(UserDocument);
export const imageRepo = AppDataSource.getRepo(ImageEntity);
export const questRepo = AppDataSource.getRepo(QuestEntity);
