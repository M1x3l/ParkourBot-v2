// Servers the bot should operate in
const servers = new Array(
	'774265785455083531', // Bot testing server
	'796365707976900649', // Mixel's other test server
	'746681304111906867' // Steve's Underwater Paradise
);

// Embed colors that should be used
const embedColors = new Array(
	'#0099FF', // Info
	'#FF0000' // Error
);

// Maps booleans to emojis
const boolToEmojiMap = new Map<boolean, string>([
	[false, ':x:'],
	[true, ':white_check_mark:'],
]);

// The member count voice channels that should be updated
const memberCountVoiceChannelIDs = new Array(
	'818456788113948743', // Steve's Underwater Paradise
	'815221664320192522' // Bot testing server
);

// Maps server boost levels to strings
const serverBoostLevelMap = new Map<string, string>([
	['NONE', 'no level'], // No server boosts
	['TIER_1', 'level 1'], // Boost level 1
	['TIER_2', 'level 2'], // Boost level 2
	['TIER_3', 'level 3'], // Boost level 3
	['TIER_4', 'level 4'], // Boost level 4
]);

export {
	servers,
	embedColors,
	boolToEmojiMap,
	memberCountVoiceChannelIDs,
	serverBoostLevelMap,
};
