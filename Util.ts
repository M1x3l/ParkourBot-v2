import {
	Client,
	Collection,
	ColorResolvable,
	CommandInteraction,
	Guild,
	GuildChannel,
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
	memberCountVoiceChannelIDs,
	embedColors,
	serverBoostLevelMap,
	servers,
	defaultBoolToEmojiMap,
	onlineCountVoiceChannelIDs,
} from './botconfig';
import { logBot } from './Loggers';
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

//#region updateMemberCount
async function updateMemberCount(guild: Guild) {
	// Check if the guild is available
	if (!guild.available) return;

	// Find voice channel that belongs to the guild, and update it
	memberCountVoiceChannelIDs.forEach((id) => {
		const channel = guild.channels.cache.get(id) as GuildChannel;
		if (!channel) return;

		channel.edit({ name: generateMemberCountChannelName(channel) });

		logBot(guild.client, `Member count updated in ${guild.name} (${guild.id})`);
	});
}

async function updateMemberCountAll(client: Client) {
	// Iterate through all voice channels and update them (as defined in botconfig.ts)
	memberCountVoiceChannelIDs.forEach((id) => {
		const channel = client.channels.cache.get(id) as GuildChannel;

		channel.edit({ name: generateMemberCountChannelName(channel) });
	});

	logBot(client, `Member count updated in all servers`);
}

async function updateOnlineCount(guild: Guild) {
	if (!guild.available) return;

	onlineCountVoiceChannelIDs.forEach((id) => {
		const channel = guild.channels.cache.get(id);
		if (!channel || !(channel.type == 'GUILD_VOICE')) return;

		const newName = generateOnlineCountChannelName(channel);
		if (channel.name == newName) return;
		channel.edit({ name: newName });

		logBot(
			guild.client,
			`Online count updated to ${guild.presences.cache.size} in ${guild.name} (${guild.id})`
		);
	});
}

async function updateOnlineCountAll(client: Client) {
	onlineCountVoiceChannelIDs.forEach((id) => {
		const channel = client.channels.cache.get(id) as GuildChannel;

		const newName = generateOnlineCountChannelName(channel);
		if (channel.name == newName) return;
		channel.edit({ name: newName });
	});

	logBot(client, `Online count updated in all servers`);
}

const generateMemberCountChannelName = (channel: GuildChannel) =>
	`${channel.name.replace(/\d+/g, '').trim()} ${channel.guild.memberCount}`;

const generateOnlineCountChannelName = (channel: GuildChannel) =>
	`${channel.name.replace(/\d+/g, '').trim()} ${
		channel.guild.presences.cache.size
	}`;
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

//#region commandHelpers
function generateUserInfoEmbed(interaction: CommandInteraction) {
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
		.setFooter(
			interaction.guild.name,
			interaction.guild.iconURL() as unknown as string
		)
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
			interaction.guild.name,
			interaction.guild.iconURL() as unknown as string
		)
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

export {
	chatInputCommands,
	userCommands,
	messageCommands,
	updateMemberCount,
	updateMemberCountAll,
	updateOnlineCount,
	updateOnlineCountAll,
	getTasks,
	filterSuggestions,
	createTask,
	generateUserInfoEmbed,
	generateServerInfoEmbed,
	boolToEmojiMap,
};
