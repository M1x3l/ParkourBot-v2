import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ChatInputCommandFile } from '../Types';

export const file: ChatInputCommandFile = {
	name: 'rules',
	description: 'Tell somebody, they should read the rules',
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
			(() =>
				interaction.guild?.rulesChannel
					? `**Please read <#${interaction.guild.rulesChannel}>**`
					: '**Please read the rules**')()
		);
		if (username)
			embed.setDescription(
				`${embed.description}\nWith that I mean you, ${username}`
			);
		interaction.reply({ embeds: [embed] });
	},
};
