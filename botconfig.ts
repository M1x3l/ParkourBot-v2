import { PermissionResolvable, PremiumTier, Snowflake } from 'discord.js';

// Servers the bot should operate in
export const servers: Snowflake[] = [
	'774265785455083531', // Bot testing server
	'796365707976900649', // Mixel's other test server
	'746681304111906867', // Steve's Underwater Paradise
];

// Embed colors that should be used
export const embedColors = [
	'#0099FF', // Info
	'#FF0000', // Error
];

// Maps booleans to emojis
export const defaultBoolToEmojiMap = new Map<boolean, string>([
	[false, ':x:'],
	[true, ':white_check_mark:'],
]);

// The member count voice channels that should be updated
export const memberCountVoiceChannelIDs: Snowflake[] = [
	'818456788113948743', // Steve's Underwater Paradise
	'815221664320192522', // Bot testing server
];

// Maps server boost levels to strings
export const serverBoostLevelMap = new Map<PremiumTier, string>([
	['NONE', 'no level'], // No server boosts
	['TIER_1', 'level 1'], // Boost level 1
	['TIER_2', 'level 2'], // Boost level 2
	['TIER_3', 'level 3'], // Boost level 3
]);

// Allowed command channel names
export const allowedChatInputChannelNames = ['bots'];

export const bypassCommandWhitelistPermissions: PermissionResolvable[] = [
	'ADMINISTRATOR',
	'MANAGE_CHANNELS',
	'MANAGE_CHANNELS',
	'MANAGE_GUILD',
];
