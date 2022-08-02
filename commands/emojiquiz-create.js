const { SlashCommandBuilder } = require('discord.js');
const { emojiquiz } = require('../db.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('emojiquiz-create')
		.setDescription('Creates emojiquiz.')
		.addStringOption(option =>
			option.setName('emoji-word')
				.setDescription('Enter the word in emojis.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('emoji-hint')
				.setDescription('Give a hint.')
				.setRequired(true))
				.addStringOption(option =>
			option.setName('searched-word')
				.setDescription('Enter the searched word.')
				.setRequired(true)),
	async execute(interaction) {
		const emoji_word = await interaction.options.getString('emoji-word');
        const emoji_hint = await interaction.options.getString('emoji-hint');
        const searched_word = await interaction.options.getString('searched-word');
		emojiquiz.guildID = interaction.guildId;
		emojiquiz.guildName = interaction.member.guild.name;
		emojiquiz.word = emoji_word;
		emojiquiz.hint = emoji_hint;
		emojiquiz.searched_word = searched_word;
		emojiquiz.interaction = interaction;
		emojiquiz.createEmojiQuiz();


	},
};