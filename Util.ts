import { Collection, Guild } from 'discord.js';
import { CommandFile } from './Types';
import { readdirSync } from 'fs';
import { join } from 'path';

//#region commands
let commands = new Collection<string, CommandFile>();

const commandFiles = readdirSync(join(__dirname, 'commands')).filter((file) =>
  file.endsWith('.js')
);

for (const file of commandFiles) {
  const command = require(join(__dirname, 'commands', file)).file;
  commands.set(command.name, command);
}
//#endregion

//#region updateMemberCount
async function updateMemberCount(guild: Guild) {
  const memberCount = guild.memberCount;
  const memberCountChannel = guild.channels.cache.find((channel) =>
    /Member Count: (\d*|undefined)/.test(channel.name)
  );
  memberCountChannel?.edit({ name: `Member Count: ${memberCount}` });
}
//#endregion

export { commands, updateMemberCount };
