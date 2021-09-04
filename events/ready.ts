import { Client } from 'discord.js';
import { logBot } from '../Loggers';
import { commands, updateMemberCountAll } from '../Util';

export async function run(client: Client) {
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

	updateMemberCountAll(client);
}
