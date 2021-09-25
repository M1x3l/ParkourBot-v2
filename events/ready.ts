import { Client } from 'discord.js';
import { errBot, logBot } from '../Loggers';
import {
	addUserGame,
	chatInputCommands,
	messageCommands,
	queryUserGames,
	updateMemberCountAll,
	updateOnlineCountAll,
	userCommands,
} from '../Util';
import { servers } from '../botconfig';
import mongoose from 'mongoose';

export async function run(client: Client) {
	logBot(client, 'Bot logged in successfully');

	const guild = client.guilds.cache.filter((guild) =>
		servers.includes(guild.id)
	);

	guild.each(async (guild) => {
		// await guild.commands.set([]);

		chatInputCommands.each((command) => {
			guild.commands.create({
				name: command.name,
				description: command.description,
				options: command.options,
				defaultPermission: command.defaultPermission,
			});
		});
		messageCommands.each((command) => {
			guild.commands.create({
				name: command.name,
				type: command.type,
				defaultPermission: command.defaultPermission,
			});
		});
		userCommands.each((command) => {
			guild.commands.create({
				name: command.name,
				type: command.type,
				defaultPermission: command.defaultPermission,
			});
		});
	});

	// Set rich presence
	client.user?.setActivity("over Steve's server because I can :)", {
		type: 'WATCHING',
	});

	updateMemberCountAll(client);
	updateOnlineCountAll(client);

	if (process.env.MONGO_URI_USERGAMES)
		try {
			await mongoose.connect(process.env.MONGO_URI_USERGAMES);
			logBot(client, 'Connected to MongoDB');
			process.env.MONGO_CONNECTED = 'true';
		} catch (err) {
			errBot(client, 'Error connecting to MongoDB\n', err);
		}
}
