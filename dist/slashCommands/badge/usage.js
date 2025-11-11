import { ChatInputCommandInteraction } from "discord.js";
import { SlashCommand, slashCommandFlags } from "../../lib/quest/handler/slashCommand.js";
import { CustomClient } from "../../core/customClient.js";
import { I18nInstance } from "../../core/i18n.js";
import { ChildManager } from "../../core/ChildManager.js";
import { EmbedBuilder } from "../../lib/quest/handler/embedBuilder.js";
import numeral from 'numeral';
import pidusage from 'pidusage';

export default class setLang extends SlashCommand {
    constructor() {
        super();
        this.name = "usage";
        this.description = "Show the bot's process usage";
        this.options = [];
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
        const ids = [process.pid, ...ChildManager.pids];

        const ram = await Promise.all(ids.map(e => getProcessUsage(e)));
        const totalRam = ram.reduce((acc, curr) => acc + curr.memory, 0);
        const totalCpu = ram.reduce((acc, curr) => acc + curr.cpu, 0);

        let text = '';
        text += `- **${i18n.t("usage.totalRam")}:** \`${totalRam.toFixed(2)} MB\`\n`;
        text += `- **${i18n.t("usage.totalCpu")}**: \`${totalCpu.toFixed(2)}%\`\n`;
        text += `- **${i18n.t("usage.currentSolvers")}:** \`${ChildManager.TotalUsage}\`\n`;
        text += `- **${i18n.t("usage.childProcess")}**: \`${ram.length - 1}\`\n`;
        text += `# **${i18n.t("usage.processUsage")}**:\n\n`;

        ram.forEach((e, i) => {
            text += `-# - **${i18n.t("usage.PID")}:** \`${ids[i]}\` - **${i18n.t("usage.ram")}:** \`${e.memory.toFixed(2)} ${i18n.t("usage.mb")}\` - **${i18n.t("usage.cpu")}:** \`${e.cpu.toFixed(2)}%\` ${ids[i] === process.pid ? `(${i18n.t("usage.main")})` : ""}\n`;
        });

        interaction.editReply({
            embeds: [new EmbedBuilder().setDescription(text).setColor("Random")]
        });
    }
}

async function getProcessUsage(pid) {
    try {
        const stats = await pidusage(pid);
        return {
            cpu: stats.cpu,
            memory: numeral(stats.memory / 1024 / 1024).value(),
        };
    } catch (error) {
        console.error('Error fetching process usage:', error);
        return { cpu: 0, memory: 0 };
    }
}
