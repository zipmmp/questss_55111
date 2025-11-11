import { DataSource, LessThan, Like, } from "typeorm";
import { BaseDocumentMongo, BaseDocumentSql } from "../lib/quest/handler/BaseDocument.js";
import config from "../config/config.js";
import { SupportedDatabaseTypes } from "./databaseConfig.js";
import { Logger } from "./logger.js";
import { ObjectId } from "mongodb";
export class CustomDataSource extends DataSource {
    constructor(options) {
        super(options);
    }
    smartLessThan(value) {
        if (config.database.type === SupportedDatabaseTypes.MongoDB) {
            return { $lte: value };
        }
        else {
            return LessThan(value);
        }
    }
    getRepo(entity) {
        if (config.database.type === SupportedDatabaseTypes.MongoDB) {
            return this.getMongoRepository(entity);
        }
        return this.getRepository(entity);
    }
    getSpecificRepo(entities) {
        const flatEntities = entities.flat();
        const correctEntity = flatEntities.find((entity) => {
            const proto = entity.prototype;
            if (config.database.type === SupportedDatabaseTypes.MongoDB) {
                return proto instanceof BaseDocumentMongo;
            }
            else {
                return proto instanceof BaseDocumentSql;
            }
        });
        if (!correctEntity) {
            Logger.error("No matching entity found for the current database type.");
        }
        return this.getRepo(correctEntity);
    }
    smartId(id) {
        if (config.database.type === SupportedDatabaseTypes.MongoDB) {
            if (!(id instanceof ObjectId) && typeof id === "string") {
                id = new ObjectId(id);
            }
            return { _id: id };
        }
        return { id: id };
    }
    getSmartWhereClause(field, value) {
        const isMongo = config?.database?.type === SupportedDatabaseTypes.MongoDB;
        if (isMongo) {
            return { [field]: value };
        }
        else {
            return [
                { [field]: Like(`${value},%`) }, // starts with
                { [field]: Like(`%,${value},%`) }, // middle
                { [field]: Like(`%,${value}`) }, // end
                { [field]: `${value}` }, // only
            ];
        }
    }
}
