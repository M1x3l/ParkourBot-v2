import { GuildMember, PartialGuildMember } from 'discord.js';
import { updateMemberCount } from '../Util';

export async function run(member: GuildMember | PartialGuildMember) {
  updateMemberCount(member.guild);
}
