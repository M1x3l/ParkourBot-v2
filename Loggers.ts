import { Client } from 'discord.js';
import { magenta, white, blueBright } from 'cli-color';

const primaryClr = magenta;
const secondaryClr = white;
const messageClr = blueBright;

export function logBot(client: Client, message: string, ...data: any[]) {
	console.log(
		`${secondaryClr('[')}${primaryClr(
			client.user?.tag
		)}@${new Date().getHours()}:${new Date().getMinutes()}${secondaryClr(
			']: '
		)}${messageClr(message)}`,
		...data
	);
}

export function logFile(file: string, message: string, ...data: any[]) {
	console.log(
		`${secondaryClr('[')}${primaryClr(
			file.replace(process.cwd(), '')
		)}${secondaryClr(']: ')}${messageClr(message)}`,
		...data
	);
}
