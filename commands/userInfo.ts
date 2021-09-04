import {
	ColorResolvable,
	CommandInteraction,
	Interaction,
	MessageEmbed,
} from 'discord.js';
import { CommandFile } from '../Types';
import { embedColors, boolToEmojiMap } from '../botconfig';
import { logBot } from '../Loggers';

export const file: CommandFile = {
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
		// Check if guild is available
		if (!interaction.guild?.available) return;

		let user;
		if (interaction.options.data[0]?.user != undefined) {
			user = interaction.options.data[0]?.user;
		} else {
			user = interaction.user;
		}
		const guildMember = interaction.guild.members.cache.get(user.id);

		const accountCreatedTimestamp = Math.floor(user.createdTimestamp / 1000);
		const serverJoinedTimestamp = Math.floor(
			guildMember?.joinedTimestamp! / 1000
		);

		let guildMemberStatus = '';
		if (guildMember?.presence?.status.toString() != undefined) {
			guildMemberStatus = guildMember?.presence?.status.toString();
		} else {
			guildMemberStatus = 'offline';
		}
		const guildMemberStatusEmoji = guildMember?.guild.emojis.cache
			.filter((e) => e.name == guildMemberStatus)
			.first()
			?.toString();

		let guildMemberActivities;
		if (
			guildMember?.presence?.activities != undefined &&
			guildMember?.presence?.activities.length <= 0 == false
		) {
			guildMemberActivities = guildMember?.presence?.activities
				.join(', ')
				.replace('*', '\\*');
		} else {
			guildMemberActivities = 'none';
		}

		const id = user.id;
		const userIsBot = boolToEmojiMap.get(user.bot);

		// Create embed
		const embed = new MessageEmbed()
			.setColor(embedColors[0] as ColorResolvable)
			.setTitle(`User info for ${user.tag}`)
			.setDescription(
				`Status: **${guildMemberStatus}${guildMemberStatusEmoji}** 
				Activity: **${guildMemberActivities}** 
				\n Account created: **<t:${accountCreatedTimestamp}>** 
				Joined server at: **<t:${serverJoinedTimestamp}>**  
				\n ID: **${id}** 
				Is bot: **${userIsBot}**`
			)
			.setThumbnail(user.avatarURL() as unknown as string)
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
