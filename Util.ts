import { Collection, Guild } from 'discord.js';
import { CommandFile, Task } from './Types';
import { readdir } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
config();
const ClickUp = require('clickup.js');

const clickupClient = new ClickUp(process.env.CLICKUP_TOKEN);

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
	const memberCount = guild.memberCount;
	const memberCountChannel = guild.channels.cache.find((channel) =>
		/Member Count: (\d*|undefined)/.test(channel.name)
	);
	memberCountChannel?.edit({ name: `Member Count: ${memberCount}` });
}
//#endregion

//#region clickup
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
	clickupClient.lists.createTask('78364866', data);
}
//#endregion

export { commands, updateMemberCount, getTasks, filterSuggestions, createTask };
