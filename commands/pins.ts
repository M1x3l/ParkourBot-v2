import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ChatInputCommandFile } from '../Types';

export const file: ChatInputCommandFile = {
	name: 'pins',
	description: 'Tell somebody, they should read the pinned messages',
	options: [
		{
			name: 'user',
			description: 'The user you want to remind',
			type: 'USER',
		},
	],
	run: async (interaction: CommandInteraction) => {
		const username = interaction.options.data[0]?.user?.username;
		const embed = new MessageEmbed().setDescription(
			'**Please read the pinned messages**'
		);
		if (username)
			embed.setDescription(
				`${embed.description}\nWith that I mean you, ${username}`
			);
		interaction.reply({ embeds: [embed] });
	},
};
