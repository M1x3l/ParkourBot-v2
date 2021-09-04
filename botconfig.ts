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

export { embedColors, boolToEmojiMap, memberCountVoiceChannelIDs };
