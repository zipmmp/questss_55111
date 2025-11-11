"discord.js";
import questsConfig from "../../config/questsConfig.js";
import { baseDiscordEvent } from "../../lib/quest/handler/baseClientEvent.js";
export default class readyEvent extends baseDiscordEvent {
    constructor() {
        super(...arguments);
        this.name = "voiceStateUpdate";
        this.once = true;
    }
    async executeEvent(oldState, newState) {
        const guild = newState.guild;
        if (!guild)
            return;
        const member = newState.member;
        if (!member || !questsConfig?.voice?.role)
            return;
        if (member.roles.cache.has(questsConfig.voice.role)) {
            await member.roles.remove(questsConfig.voice.role).catch(() => null);
        }
    }
}
