import { GuildMember } from 'discord.js';
import { updateMemberCount } from '../Util';

export async function run(member: GuildMember) {
  updateMemberCount(member.guild);
}
