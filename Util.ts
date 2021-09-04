import {
	ChannelManager,
	Collection,
	Guild,
	GuildChannel,
	GuildChannelManager,
} from 'discord.js';
import { CommandFile } from './Types';
import { readdir } from 'fs';
import { join } from 'path';

import { memberCountVoiceChannelIDs } from './botconfig';
import { client } from './index';

//#region commands
let commands = new Collection<string, CommandFile>();

readdir(join(__dirname, 'commands'), (err, files) => {
	if (err) console.error(err);

	const commandFiles = files.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(join(__dirname, 'commands', file)).file;
		commands.set(command.name, command);
	}
});
//#endregion

//#region updateMemberCount
async function updateMemberCount(guild: Guild) {
	// Check if the guild is available
	if (guild.available == false) {
		return;
	}

	// Find voice channel that belongs to the guild, and update it
	for (let i = 0; i < memberCountVoiceChannelIDs.length; i++) {
		var channel = client.channels.cache.get(
			memberCountVoiceChannelIDs[i]
		) as GuildChannel;
		if (channel == undefined) {
			continue;
		}

		var guild = channel.guild;

		var memberCount = guild.memberCount;
		var newChannelName =
			channel.name.replace(/\d+/g, '').trim() + ' ' + memberCount;

		channel.edit({ name: newChannelName });

		console.log(
			'[' + client.user?.username + '] ' + 'member count updated in server ' + guild.id + '!'
		);
	}
}

async function updateMemberCountAll() {
	// Iterate through all voice channels and update them (as defined in botconfig.ts)
	for (let i = 0; i < memberCountVoiceChannelIDs.length; i++) {
		var channel = client.channels.cache.get(
			memberCountVoiceChannelIDs[i]
		) as GuildChannel;
		var guild = channel.guild;

		var memberCount = guild.memberCount;
		var newChannelName =
			channel.name.replace(/\d+/g, '').trim() + ' ' + memberCount;

		channel.edit({ name: newChannelName });
	}

	console.log(
		'[' + client.user?.username + '] ' + 'member count updated in all servers!'
	);
}
//#endregion

export { commands, updateMemberCount, updateMemberCountAll };
