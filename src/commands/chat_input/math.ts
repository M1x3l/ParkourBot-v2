import { MessageEmbed, Options } from 'discord.js';
import saveEval from '../../SaveEval';
import { ChatInputCommandFile } from '../../Types';

export const file: ChatInputCommandFile = {
	type: 'CHAT_INPUT',
	options: [
		{
			type: 'SUB_COMMAND',
			name: 'info',
			description: 'Display info about the Math command',
		},
		{
			type: 'SUB_COMMAND',
			name: 'eval',
			description:
				"Evaluate a math expression, to get more info use '/math info'",
			options: [
				{
					type: 'STRING',
					description: 'Math Expression',
					name: 'expr',
					required: true,
				},
			],
		},
	],
	name: 'math',
	description: 'Evaluate simple mathematical expressions',
	run: async (interaction) => {
		const options = {
			variables: {
				PI: Math.PI,
				E: Math.E,
				PHI: 0.5 + 5 ** 0.5 * 0.5,
			},
			functions: {
				sin: Math.sin,
				cos: Math.cos,
				tan: Math.tan,
				random: Math.random,
				floor: Math.floor,
				ceil: Math.ceil,
				round: Math.round,
				pow: Math.pow,
				sqrt: Math.sqrt,
				cbrt: Math.cbrt,
				log: Math.log,
				log2: Math.log2,
				log10: Math.log10,
			},
		};

		switch (interaction.options.getSubcommand()) {
			case 'eval': {
				try {
					const expr = interaction.options.getString('expr', true);
					interaction.reply({
						content: `${expr} = ${saveEval(expr, options)}`,
						ephemeral: true,
					});
				} catch (err: any) {
					interaction.reply({
						content: `**${err.name}**: ${err.message}`,
						ephemeral: true,
					});
				}
				break;
			}
			case 'info': {
				interaction.reply({
					embeds: [
						new MessageEmbed({
							title: 'Math',
							fields: [
								{
									name: 'Available Operations:',
									value: `**\`+\`**, **\`-\`**, **\`*\`**, **\`/\`**, **\`%\`**, **\`^\`**`,
								},
								{
									name: 'Available variables:',
									value: Object.entries(options.variables)
										.map((key) => `**\`${key[0]}\`:** \`${key[1]}\``)
										.join('\n'),
								},
								{
									name: 'Available functions:',
									value: Object.keys(options.functions)
										.map((key) => `\`${key}\``)
										.join('\n'),
								},
							],
						}),
					],
					ephemeral: true,
				});
			}
		}
	},
};
