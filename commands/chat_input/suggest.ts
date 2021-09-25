import { CommandInteraction, MessageEmbed } from 'discord.js';
import { ChatInputCommandFile } from '../../Types';
import { createTask } from '../../Util';

export const file: ChatInputCommandFile = {
	name: 'suggest',
	description: 'Create a suggestion',
	options: [
		{
			name: 'type',
			description: 'The type of suggestion you want to make',
			type: 'STRING',
			choices: [
				{ name: 'Discord', value: 'discord' },
				{ name: 'Game', value: 'game' },
			],
			required: true,
		},
		{
			name: 'title',
			description:
				'The title for your suggestion, try to keep this as short as possible (still at least 5 characters)',
			type: 'STRING',
			required: true,
		},
		{
			name: 'content',
			description:
				'The content for your suggestion, text or valid markdown ({\\n}=new line) (at least 20 characters)',
			type: 'STRING',
			required: true,
		},
	],
	run: async (interaction: CommandInteraction) => {
		const [type, title, content] = interaction.options.data;

		if (!title.value?.toString.length || title.value?.toString.length < 5) {
			interaction.reply({
				content: 'Title needs to at least be 5 characters long',
				ephemeral: true,
			});
			return;
		}

		if (
			!content.value?.toString.length ||
			content.value?.toString.length < 20
		) {
			interaction.reply({
				content: 'Content needs to at least be 20 characters long',
				ephemeral: true,
			});
			return;
		}

		const task = await createTask({
			name: title.value?.toString()!,
			markdown_description: content.value?.toString().replace(/{\\n}/g, '\n'),
			status: 'Open',
			tags: ['suggestion', type.value?.toString()!],
			custom_fields: [
				{
					id: '66087f65-0d16-407f-a64d-6632f05b8e59',
					value: interaction.user.tag,
				},
				{
					id: '19246113-631f-4371-8596-1be06ecc6d9c',
					value: Date.now(),
				},
			],
		});

		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle('Created Suggestion')
					.setDescription(
						'Click the button below to view the suggestion in your browser'
					),
			],
			components: [
				{
					type: 'ACTION_ROW',
					components: [
						{
							type: 'BUTTON',
							label: 'View Suggestion',
							url: `https://app.clickup.com/t/${task.body.id}`,
							style: 'LINK',
						},
					],
				},
			],
			ephemeral: true,
		});
	},
};
