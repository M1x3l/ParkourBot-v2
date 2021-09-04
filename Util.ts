import { Client, Collection, Guild, GuildChannel } from 'discord.js';
import {
	/* UserCommandFile,
	MessageCommandFile, */
	ChatInputCommandFile,
	Task,
} from './Types';
import { readdir } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import { memberCountVoiceChannelIDs } from './botconfig';
import { logBot } from './Loggers';
config();

//#region commands
const chatInputCommands = new Collection<string, ChatInputCommandFile>();

readdir(join(__dirname, 'commands'), (err, files) => {
	if (err) console.error(err);

	const commandFiles = files.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(join(__dirname, 'commands', file)).file;
		chatInputCommands.set(command.name, command);
	}
});
//#endregion

//#region updateMemberCount
async function updateMemberCount(guild: Guild) {
	// Check if the guild is available
	if (!guild.available) return;

	// Find voice channel that belongs to the guild, and update it
	memberCountVoiceChannelIDs.forEach((id) => {
		const channel = guild.client.channels.cache.get(id) as GuildChannel;

		if (channel) {
			channel.edit({ name: generateMemberCountChannelName(channel) });

			logBot(
				guild.client,
				`Member count updated in ${guild.id} (${guild.name})`
			);
		}
	});
}

async function updateMemberCountAll(client: Client) {
	// Iterate through all voice channels and update them (as defined in botconfig.ts)
	memberCountVoiceChannelIDs.forEach((id) => {
		const channel = client.channels.cache.get(id) as GuildChannel;

		channel.edit({ name: generateMemberCountChannelName(channel) });
	});

	logBot(client, `Member count updated in all server`);
}

const generateMemberCountChannelName = (channel: GuildChannel) =>
	`${channel.name.replace(/\d+/g, '').trim()} ${channel.guild.memberCount}`;
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
	updateMemberCount,
	updateMemberCountAll,
	getTasks,
	filterSuggestions,
	createTask,
};
