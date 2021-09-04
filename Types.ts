import {
	CommandInteraction,
	MessageApplicationCommandData,
	UserApplicationCommandData,
	ChatInputApplicationCommandData,
} from 'discord.js';

export interface MessageCommandFile extends MessageApplicationCommandData {
	run: (interaction: CommandInteraction) => Promise<void>;
}
export interface UserCommandFile extends UserApplicationCommandData {
	run: (interaction: CommandInteraction) => Promise<void>;
}
export interface ChatInputCommandFile extends ChatInputApplicationCommandData {
	run: (interaction: CommandInteraction) => Promise<void>;
}

export interface Task {
	name: string;
	description?: string;
	markdown_description?: string;
	tags: string[];
	status: string;
	priority?: TaskPriority;
	custom_fields?: CustomField[];
}

export interface CustomField {
	id: string;
	value: any;
}

export enum TaskPriority {
	'URGENT' = 1,
	'HIGH' = 2,
	'NORMAL' = 3,
	'LOW' = 4,
}
