import { config } from 'dotenv';
config();
import { Client } from 'discord.js';
import { logBot } from './Loggers';
import { EventManager } from './EventManager';

const client = new Client({
	intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_PRESENCES'],
});

EventManager(client);

client.login(process.env.TOKEN);
