import { ColorResolvable, CommandInteraction, MessageEmbed } from 'discord.js';
import { ChatInputCommandFile } from '../../Types';
import { generateServerInfoEmbed } from '../../Util';

export const file: ChatInputCommandFile = {
	name: 'serverinfo',
	description: "Shows the current server's info.",

	run: async (interaction: CommandInteraction) => {
		interaction.reply({
			embeds: [generateServerInfoEmbed(interaction)!],
		});
	},
};
