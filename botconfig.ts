const embedColors = new Array(
	'#0099FF', // Info
	'#FF0000' // Error
);

const boolToEmojiMap = new Map<boolean, string>([
	[false, ':x:'],
	[true, ':white_check_mark:'],
]);

const memberCountVoiceChannelIDs = new Array(
	'818456788113948743', // Steve's Underwater Paradise
	'815221664320192522' // Bot testing server
);

const serverBoostLevelMap = new Map<string, string>([
	['NONE', 'no level'], // No server boosts
	['TIER_1', 'level 1'], // Boost level 1
	['TIER_2', 'level 2'], // Boost level 2
	['TIER_3', 'level 3'], // Boost level 3
	['TIER_4', 'level 4'], // Boost level 4
]);

export { embedColors, boolToEmojiMap, memberCountVoiceChannelIDs, serverBoostLevelMap };
