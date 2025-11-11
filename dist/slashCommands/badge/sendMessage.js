import { ChatInputCommandInteraction, SlashCommandStringOption } from "discord.js";
import { SlashCommand, slashCommandFlags } from "../../lib/quest/handler/slashCommand.js";
import { CustomClient } from "../../core/customClient.js";
import { I18nInstance } from "../../core/i18n.js";
import { EmbedBuilder } from "../../lib/quest/handler/embedBuilder.js";
import { usersCache } from "../../core/cache.js";

export default class setLang extends SlashCommand {
    constructor() {
        super();
        this.name = "send_message";
        this.description = "Send a message to all quest solver users";
        this.options = [
            new SlashCommandStringOption()
                .setRequired(true)
                .setName("message")
                .setDescription("message")
                .setMinLength(3)
        ];
        this.cooldown = "1m";
        this.allowedRoles = [];
        this.allowedServers = [];
        this.allowedUsers = [];
        this.allowedChannels = [];
        this.permissions = [];
        this.bot_permissions = [];
        this.flags = ["devOnly", "ephemeral", "onlyDm", "onlyGuild"];
    }

    async execute({ interaction, client, i18n, lang }) {
        const message = interaction.options.getString("message", true);

        const solvers = usersCache.filter(e => e.started && e.process);
        if (solvers.size === 0) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`${i18n.t("sendMessage.noUsers")}`)
                        .setColor("DarkRed")
                ]
            });
        }

        solvers.forEach(user => {
            user.emit("message", { message, type: "devlopers_message" });
        });

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${i18n.t("sendMessage.messageSent", { users: solvers.size.toString() })}`)
                    .setColor("Green")
            ]
        });
    }
}
