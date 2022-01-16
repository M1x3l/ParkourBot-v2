import { Client } from 'discord.js';
import { logBot } from '../Loggers';
import { chatInputCommands, messageCommands, userCommands } from '../Util';
import { servers } from '../botconfig';

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
}
