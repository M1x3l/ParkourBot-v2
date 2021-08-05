import { ApplicationCommandData, CommandInteraction } from 'discord.js';

export interface CommandFile extends ApplicationCommandData {
  run: (interaction: CommandInteraction) => Promise<void>;
}
