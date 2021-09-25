import { Client } from 'discord.js';
import { magenta, white, blueBright, redBright, bold, red } from 'cli-color';

const primaryClrLog = magenta;
const secondaryClrLog = white;
const messageClrLog = blueBright;

const primaryClrErr = (...text: any[]) => bold(red(...text));
const secondaryClrErr = white;
const messageClrErr = redBright;

export function logBot(client: Client, message: string, ...data: any[]) {
	console.log(
		`${secondaryClrLog('[')}${primaryClrLog(
			client.user?.tag
		)}@${new Date().getHours()}:${new Date().getMinutes()}${secondaryClrLog(
			']: '
		)}${messageClrLog(message)}`,
		...data
	);
}

export function logFile(file: string, message: string, ...data: any[]) {
	console.log(
		`${secondaryClrLog('[')}${primaryClrLog(
			file.replace(process.cwd(), '')
		)}${secondaryClrLog(']: ')}${messageClrLog(message)}`,
		...data
	);
}

export function errBot(client: Client, message: string, ...data: any[]) {
	console.log(
		`${secondaryClrErr('[')}${primaryClrErr(
			client.user?.tag
		)}@${new Date().getHours()}:${new Date().getMinutes()}${secondaryClrErr(
			']: '
		)}${messageClrErr(message)}`,
		...data
	);
}

export function errFile(file: string, message: string, ...data: any[]) {
	console.log(
		`${secondaryClrErr('[')}${primaryClrErr(
			file.replace(process.cwd(), '')
		)}${secondaryClrErr(']: ')}${messageClrErr(message)}`,
		...data
	);
}
