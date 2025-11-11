"discord.js";
import { menuCommand } from "../lib/quest/handler/menu.js";
export default class exampleMenu extends menuCommand {
    constructor() {
        super(...arguments);
        this.name = "test_menu";
        this.description = "A test menu to verify the bot's functionality.";
        this.options = [];
        this.cooldown = "1m";
        this.allowedRoles = [];
        this.allowedServers = [];
        this.allowedUsers = [];
        this.allowedChannels = [];
        this.permissions = ["Administrator"];
        this.bot_permissions = [];
        this.flags = ["onlyGuild", "ephemeral"];
    }
    async execute({ interaction, client, i18n, lang }) {
        interaction.editReply({
            content: "test working",
        });
    }
}
