import { CommandInteraction } from 'discord.js';
import { UserCommandFile } from '../../Types';
import { generateUserInfoEmbed } from '../../Util';

export const file: UserCommandFile = {
	name: 'User Info',
	type: 'USER',
	run: async (interaction: CommandInteraction) => {
		interaction.reply({ embeds: [generateUserInfoEmbed(interaction)!] });
	},
};
