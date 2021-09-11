import { Presence } from 'discord.js';
import { updateOnlineCount } from '../Util';

export async function run(oldPresence: Presence | null, newPresence: Presence) {
	if (!newPresence.guild) return;

	if (
		!oldPresence ||
		oldPresence.status == 'offline' ||
		newPresence.status == 'offline'
	)
		updateOnlineCount(newPresence.guild);
}
