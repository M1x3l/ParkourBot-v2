import { Interaction } from 'discord.js';
import { commands } from '../Util';

export async function run(interaction: Interaction) {
	if (!interaction.isCommand()) return;

	if (!commands.has(interaction.commandName)) return;

	try {
		await commands.get(interaction.commandName)?.run(interaction);
	} catch (err) {
		console.error(err);
		interaction.reply({
			content: 'An error occurred while processing the command',
			ephemeral: true,
		});
	}
}
