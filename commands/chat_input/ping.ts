import {
	ColorResolvable,
	CommandInteraction,
	Interaction,
	MessageEmbed,
} from 'discord.js';
import { ChatInputCommandFile } from '../../Types';
import { embedColors } from '../../botconfig';

export const file: ChatInputCommandFile = {
	name: 'ping',
	description: 'Ping pong! Checks the API latency.',

	run: async (interaction: CommandInteraction) => {
		// Check if guild is available
		if (!interaction.guild?.available) return;

		let latency = Date.now() - interaction.createdTimestamp;
		let latencyText = '';

		if (latency <= 500) {
			latencyText = 'Response time is good.';
		} else if (latency > 500 && latency <= 1000) {
			latencyText = 'Response time is ok.';
		} else {
			latencyText = 'Response time is bad.';
		}

		// Create embed
		const embed = new MessageEmbed()
			.setColor(embedColors[0] as ColorResolvable)
			.setTitle(`Roundtrip latency: ${latency}ms`)
			.setDescription(`${latencyText}`)
			.addField('\u200B', '_ _')
			.setFooter(
				interaction.guild.name,
				interaction.guild.iconURL() as unknown as string
			)
			.setTimestamp();

		interaction.reply({
			embeds: [embed],
		});
	},
};
