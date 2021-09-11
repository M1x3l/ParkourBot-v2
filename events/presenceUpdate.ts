import { Presence } from 'discord.js';
import { updateOnlineCount } from '../Util';

export async function run(oldPresence: Presence | null, newPresence: Presence) {
	if (!newPresence.guild) return;

	if (!oldPresence?.status || oldPresence.status != newPresence.status)
		updateOnlineCount(newPresence.guild);
}
