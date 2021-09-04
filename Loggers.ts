import { Client } from 'discord.js';
import { magenta } from 'cli-color';

function logBot(client: Client, message: string, ...data: any[]) {
	console.log(`[${magenta(client.user?.tag)}]: ${message}`, ...data);
}

function logFile(file: string, message: string, ...data: any[]) {
	console.log(
		`[${magenta(file.replace(process.cwd(), ''))}]: ${message}`,
		...data
	);
}

export { logBot, logFile };
