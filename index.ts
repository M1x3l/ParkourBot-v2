import { config } from 'dotenv';
config();
import { Client } from 'discord.js';
import { commands, updateMemberCountAll } from './Util';
import { logBot } from './Loggers';

//#region events
import * as interactionCreate from './events/interactionCreate';
import * as guildMemberAdd from './events/guildMemberAdd';
import * as guildMemberRemove from './events/guildMemberRemove';
//#endregion

const client = new Client({
	intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_PRESENCES'],
});

client.once('ready', () => {
	logBot(client, 'Bot logged in successfully');

	const guild = client.guilds.cache.filter((guild) =>
		['774265785455083531', '796365707976900649'].includes(guild.id)
	);

	guild.each(async (guild) => {
		// await guild.commands.set([]);

		commands.each((command) => {
			guild.commands.create({
				name: command.name,
				description: command.description,
				options: command.options,
				defaultPermission: command.defaultPermission,
			});
		});
	});

	// Set rich presence
	client.user?.setActivity("over Steve's server because I can :)", {
		type: 'WATCHING',
	});

	// Update member count VCs in all servers
	updateMemberCountAll(client);
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
