import { config } from 'dotenv';
config();
import { Client } from 'discord.js';

import { commands } from './Util';
//#region events
import * as interactionCreate from './events/interactionCreate';
import * as guildMemberAdd from './events/guildMemberAdd';
import * as guildMemberRemove from './events/guildMemberRemove';
//#endregion

const client = new Client({
	intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'],
});

client.once('ready', () => {
	console.log(`Bot logged in as ${client.user?.tag}`);

	const guild = client.guilds.cache.filter((guild) =>
		['774265785455083531', '796365707976900649'].includes(guild.id)
	);

	guild.each((guild) =>
		commands.each((command) => {
			guild.commands.create({
				name: command.name,
				description: command.description,
				options: command.options,
				defaultPermission: command.defaultPermission,
			});
		})
	);
});

client.on('interactionCreate', async (interaction) => {
	interactionCreate.run(interaction);
});

client.on('guildMemberAdd', async (member) => {
	guildMemberAdd.run(member);
});
client.on('guildMemberRemove', async (member) => {
	guildMemberRemove.run(member);
});

client.login(process.env.TOKEN);
