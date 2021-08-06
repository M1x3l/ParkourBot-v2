import { Client } from 'discord.js';

//#region events
import * as interactionCreate from './events/interactionCreate';
import * as guildMemberAdd from './events/guildMemberAdd';
import * as guildMemberRemove from './events/guildMemberRemove';
//#endregion

export function EventManager(client: Client) {
  client.on('interactionCreate', async (interaction) => {
    interactionCreate.run(interaction);
  });

  client.on('guildMemberAdd', async (member) => {
    guildMemberAdd.run(member);
  });

  client.on('guildMemberRemove', async (member) => {
    guildMemberRemove.run(member);
  });
}
