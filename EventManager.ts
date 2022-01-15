import { Client } from 'discord.js';

//#region events
import { run as interactionCreate } from './events/interactionCreate';
import { run as ready } from './events/ready';
//#endregion

export function EventManager(client: Client) {
	client
		.once('ready', ready)

		.on('interactionCreate', interactionCreate);
}
