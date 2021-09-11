import { Client } from 'discord.js';

//#region events
import { run as interactionCreate } from './events/interactionCreate';
import { run as guildMemberAdd } from './events/guildMemberAdd';
import { run as guildMemberRemove } from './events/guildMemberRemove';
import { run as presenceUpdate } from './events/presenceUpdate';
import { run as ready } from './events/ready';
//#endregion

export function EventManager(client: Client) {
	client
		.once('ready', ready)

		.on('interactionCreate', interactionCreate)

		.on('guildMemberAdd', guildMemberAdd)

		.on('guildMemberRemove', guildMemberRemove)

		.on('presenceUpdate', presenceUpdate);
}
