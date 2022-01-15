import {
	Client,
	Collection,
	ColorResolvable,
	CommandInteraction,
	ContextMenuInteraction,
	Guild,
	MessageEmbed,
} from 'discord.js';
import {
	UserCommandFile,
	MessageCommandFile,
	ChatInputCommandFile,
	Task,
} from './Types';
import { readdir } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import {
	embedColors,
	serverBoostLevelMap,
	servers,
	defaultBoolToEmojiMap,
} from './botconfig';
import { logBot } from './Loggers';
import {} from 'mongoose';
config();

//#region commands
const chatInputCommands = new Collection<string, ChatInputCommandFile>();
const messageCommands = new Collection<string, MessageCommandFile>();
const userCommands = new Collection<string, UserCommandFile>();

readdir(join(__dirname, 'commands', 'chat_input'), (err, files) => {
	if (!files) return;

	if (err) console.error(err);

	const commandFiles = files.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(join(
			__dirname,
			'commands',
			'chat_input',
			file
		)).file;
		chatInputCommands.set(command.name, command);
	}
});

readdir(join(__dirname, 'commands', 'message'), (err, files) => {
	if (!files) return;

	if (err) console.error(err);

	const commandFiles = files.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(join(__dirname, 'commands', 'message', file)).file;
		messageCommands.set(command.name, command);
	}
});

readdir(join(__dirname, 'commands', 'user'), (err, files) => {
	if (!files) return;

	if (err) console.error(err);

	const commandFiles = files.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(join(__dirname, 'commands', 'user', file)).file;
		userCommands.set(command.name, command);
	}
});

//#endregion

//#region commandHelpers
function generateUserInfoEmbed(
	interaction: ContextMenuInteraction | CommandInteraction
) {
	if (!interaction.guild?.available) return;

	let user;
	if (interaction.options.data[0]?.user) {
		user = interaction.options.data[0]?.user;
	} else {
		user = interaction.user;
	}
	const guildMember = interaction.guild.members.cache.get(user.id);

	let guildMemberNickname;
	if (guildMember?.nickname != null) {
		guildMemberNickname = guildMember?.nickname;
	} else {
		guildMemberNickname = 'none';
	}

	let guildMemberStatus = '';
	if (guildMember?.presence?.status.toString()) {
		guildMemberStatus = guildMember?.presence?.status.toString();
	} else {
		guildMemberStatus = 'offline';
	}
	const guildMemberStatusEmoji = guildMember?.client.guilds.cache
		.get(servers[0])
		?.emojis.cache.filter((e) => e.name == guildMemberStatus)
		.first()
		?.toString();

	let guildMemberActivities;
	if (
		guildMember?.presence?.activities &&
		guildMember?.presence?.activities.length > 0
	) {
		guildMemberActivities =
			'\n- ' +
			guildMember?.presence?.activities
				.join('\n- ')
				.replace('*', '\\*')
				.replace(
					'Custom Status',
					`Custom status: \"${
						guildMember?.presence?.activities.find(
							(activity) => activity.type === 'CUSTOM'
						)?.state
					}\"`
				);
	} else {
		guildMemberActivities = 'none';
	}

	const accountCreatedTimestamp = Math.floor(user.createdTimestamp / 1000);
	const serverJoinedTimestamp = Math.floor(
		guildMember?.joinedTimestamp! / 1000
	);

	const id = user.id;
	const userIsBot = boolToEmojiMap(interaction.guild).get(user.bot);

	// Create embed
	const embed = new MessageEmbed()
		.setColor(embedColors[0] as ColorResolvable)
		.setTitle(`User info for ${user.tag}`)
		.setDescription(
			`Nickname: **${guildMemberNickname}**
		
		Status: **${guildMemberStatus}${guildMemberStatusEmoji}**
		Activity: **${guildMemberActivities}**
		
		Account created: **<t:${accountCreatedTimestamp}>**
		Joined server at: **<t:${serverJoinedTimestamp}>**
		
		ID: **${id}**
		Is bot: **${userIsBot}**`.replace(/\t/g, '')
		)
		.addField('\u200b', '_ _')
		.setThumbnail(user.avatarURL() as unknown as string)
		.setFooter({
			text: interaction.guild.name,
			iconURL: interaction.guild.iconURL() as unknown as string,
		})
		.setTimestamp();
	return embed;
}

function generateServerInfoEmbed(interaction: CommandInteraction) {
	if (!interaction.guild?.available) return;

	const guild = interaction.guild;

	const guildName = guild.name;

	let guildOwner = interaction.guild.members.cache.get(guild.ownerId)?.user.tag;
	const serverCreatedTimestamp = Math.floor(guild.createdTimestamp / 1000);
	const id = guild.id;

	const guildMemberCount = guild.memberCount;
	const guildChannelCount = guild.channels.cache.size;
	const boostLevel = serverBoostLevelMap.get(guild.premiumTier);

	// Create embed
	const embed = new MessageEmbed()
		.setColor(embedColors[0] as ColorResolvable)
		.setTitle(`Server info for ${guildName}`)
		.setDescription(
			`Owner: **${guildOwner}**
		Server created: **<t:${serverCreatedTimestamp}>**
		ID: **${id}**

		Members: **${guildMemberCount}**
		Channels: **${guildChannelCount}**
		Boost level: **${boostLevel}**`.replace(/\t/g, '')
		)
		.addField('\u200b', '_ _')
		.setThumbnail(guild.iconURL() as unknown as string)
		.setFooter(
			{text:interaction.guild.name,
			iconURL:interaction.guild.iconURL() as unknown as string
		})
		.setTimestamp();
	return embed;
}

// Maps booleans to emojis
const boolToEmojiMap = (guild: Guild) => {
	return new Map<boolean, string>([
		[
			false,
			(
				guild.emojis.cache.find((e) => e.name == 'false') ||
				defaultBoolToEmojiMap.get(false)
			)?.toString()!,
		],
		[
			true,
			(
				guild.emojis.cache.find((e) => e.name == 'true') ||
				defaultBoolToEmojiMap.get(true)
			)?.toString()!,
		],
	]);
};

//#endregion

//#region clickup
const clickupClient = new (require('clickup.js'))(process.env.CLICKUP_TOKEN);

async function getTasks() {
	const output = JSON.parse(
		(await clickupClient.lists.getTasks('78364866')).rawBody.toString()
	);
	return output;
}

function filterSuggestions(data: any) {
	return data.tasks.filter((e: any) =>
		e.tags.some((e: any) => e.name === 'suggestion')
	);
}

async function createTask(data: Task) {
	return clickupClient.lists.createTask('78364866', data);
}
//#endregion

export {
	chatInputCommands,
	userCommands,
	messageCommands,
	getTasks,
	filterSuggestions,
	createTask,
	generateUserInfoEmbed,
	generateServerInfoEmbed,
	boolToEmojiMap,
};
