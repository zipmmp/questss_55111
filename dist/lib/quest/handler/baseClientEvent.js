import { Logger } from "../../core/logger.js";
import { i18n } from "../../providers/i18n.js";
import { AppDataSource } from "../../index.js";
/**
 * هذا الكلاس هو الأساس لأي حدث Event في البوت
 * يعتمد على `client.on` أو `client.once`
 */
export class baseDiscordEvent {
    /**
     * @param {import("../../core/customClient.js").CustomClient} client
     */
    constructor(client) {
        this.i18n = i18n;
        this.client = client;
        this.name = ""; // اسم الحدث مثل: "ready", "interactionCreate"
        this.once = false; // إذا true → يتم تشغيله مرة واحدة فقط
        this.appDataSource = AppDataSource;
        this.logger = Logger;
    }
    /**
     * يتم استدعاء هذا عند تنفيذ الحدث
     * @abstract
     * @param  {...any} args
     */
    executeEvent(...args) {
        throw new Error(`Event "${this.name}" يجب أن يطبق دالة executeEvent()`);
    }
}
/**
 * هذا لتوليد الأحداث عند التحميل
 * @param {import("../../core/customClient.js").CustomClient} client
 * @returns {new()=>baseDiscordEvent}
 */
export function baseEventConstructor(client) {
    return class extends baseDiscordEvent {
        constructor() {
            super(client);
        }
    };
}
