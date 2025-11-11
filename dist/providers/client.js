import { Options, Partials } from "discord.js";
import { CustomClient } from "../core/customClient.js";
import { loadCommands } from "../handler/loadCommands.js";
import config from "../config/config.js";
const client = new CustomClient({
    intents: 33539,
    partials: [
        Partials.Message,
        Partials.GuildMember,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
        Partials.ThreadMember
    ],
    failIfNotExists: false,
    makeCache: Options.cacheWithLimits({
        ...Options.DefaultMakeCacheSettings,
        ReactionManager: 0,
        ApplicationCommandManager: 0,
        ApplicationEmojiManager: 500,
        DMMessageManager: 25,
        GuildMemberManager: 100,
        MessageManager: 100,
        PresenceManager: 500000,
        GuildMessageManager: 10,
        UserManager: 0,
        VoiceStateManager: 0,
    }),
});
(async () => {
    await loadCommands(client);
    await client.login(config.token);
})();
export default client;
