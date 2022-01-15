import { CommandInteraction } from 'discord.js';
import { ChatInputCommandFile } from '../../Types';
import { generateUserInfoEmbed } from '../../Util';

export const file: ChatInputCommandFile = {
	name: 'userinfo',
	description: "Shows a user's info.",
	options: [
		{
			name: 'user',
			description: 'The user you want to see info of.',
			type: 'USER',
		},
	],

	run: async (interaction: CommandInteraction) => {
		interaction.reply({
			embeds: [generateUserInfoEmbed(interaction)!],
		});
	},
};
