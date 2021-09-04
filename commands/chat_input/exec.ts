import { CommandInteraction } from 'discord.js';
import { ChatInputCommandFile } from '../../Types';
import { readFileSync } from 'fs';
import { join } from 'path';

export const file: ChatInputCommandFile = {
	name: 'exec',
	description: "Execute JavaScript code, only works if you're the bot owner",
	run: async (interaction: CommandInteraction) => {
		if (interaction.user.id !== process.env.AUTHOR_ID) return;
		eval(readFileSync(join(__dirname, '..', 'exec.js')).toString());
		interaction.reply('Executed');
	},
};
