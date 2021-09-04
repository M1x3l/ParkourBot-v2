import { Interaction } from 'discord.js';
import { chatInputCommands, userCommands } from '../Util';

export async function run(interaction: Interaction) {
	if (interaction.isCommand()) {
		if (!chatInputCommands.has(interaction.commandName)) return;

		try {
			await chatInputCommands.get(interaction.commandName)?.run(interaction);
		} catch (err) {
			console.error(err);
			interaction.reply({
				content: 'An error occurred while processing the command',
				ephemeral: true,
			});
		}
	}

	if (interaction.isContextMenu()) {
		if (interaction.targetType == 'USER') {
			if (!userCommands.has(interaction.commandName)) return;

			try {
				await userCommands.get(interaction.commandName)?.run(interaction);
			} catch (err) {
				console.error(err);
				interaction.reply({
					content: 'An error occurred while processing the command',
					ephemeral: true,
				});
			}
		}
	}
}
