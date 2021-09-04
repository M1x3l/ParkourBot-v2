import { config } from 'dotenv';
config();
import { Client } from 'discord.js';
import { logBot } from './Loggers';
import { EventManager } from './EventManager';

const client = new Client({
	intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'],
});

EventManager(client);

client.login(process.env.TOKEN);
