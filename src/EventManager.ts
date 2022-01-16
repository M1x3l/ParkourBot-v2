import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { logBot } from './Loggers';

export function EventManager(client: Client) {
	const events = readdirSync(join(__dirname, 'events'));

	events.forEach((event) => {
		event = event.replace(/\.js$/, '');
		client.on(event, require(`./events/${event}`).run),
			logBot(client, `Registered '${event}' event`);
	});
}
