import { config } from 'dotenv';
import { Client } from 'discord.js';
import { EventManager } from './EventManager';
config();

const client = new Client({
	intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_PRESENCES'],
});

(async () => {
	await client.login(process.env.TOKEN);

	EventManager(client);
})();
