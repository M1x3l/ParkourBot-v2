import { CommandInteraction } from 'discord.js';
import { CommandFile } from '../Types';

export const file: CommandFile = {
	name: 'suggest',
	description: 'Create a suggestion',
	options: [
		{
			name: 'type',
			description: 'The type of suggestion you want to make',
			type: 'STRING',
			choices: [
				{ name: 'Discord', value: 'discord' },
				{ name: 'Game', value: 'game' },
			],
			required: true,
		},
		{
			name: 'title',
			description: 'The title for your suggestion',
			type: 'STRING',
			required: true,
		},
		{
			name: 'content',
			description: 'The content for your suggestion',
			type: 'STRING',
			required: true,
		},
	],
	run: async (interaction: CommandInteraction) => {
		interaction.reply(JSON.stringify(interaction.options.data));
	},
};
