import { Interaction } from 'discord.js';
import {
	allowedChatInputChannelNames,
	bypassCommandWhitelistPermissions,
} from '../botconfig';
import { chatInputCommands, userCommands } from '../Util';

export async function run(interaction: Interaction) {
	if (interaction.channel?.type == 'DM') return;

	if (interaction.isCommand()) {
		if (
			!(
				allowedChatInputChannelNames.includes(
					interaction.channel?.name || ''
				) ||
				(
					await interaction.guild?.members.fetch(interaction.user.id)!
				).permissions.any(bypassCommandWhitelistPermissions)
			)
		) {
			interaction.reply({
				content:
					'Sorry, you are not allowed to use slash commands in this channel, if there is a context-menu command with a similar behaviour, please use that one',
				ephemeral: true,
			});
			return;
		}
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
