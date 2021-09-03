import { ApplicationCommandData, CommandInteraction } from 'discord.js';

export interface CommandFile extends ApplicationCommandData {
	run: (interaction: CommandInteraction) => Promise<void>;
}

export interface Task {
	name: string;
	description: string;
	tags: string[];
	status: string;
	priority?: TaskPriority;
}

export enum TaskPriority {
	'URGENT' = 1,
	'HIGH' = 2,
	'NORMAL' = 3,
	'LOW' = 4,
}
