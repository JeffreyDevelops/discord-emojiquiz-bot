const { SlashCommandBuilder } = require('discord.js');
const { emojiquiz } = require('../db.js');
module.exports = {
	data: new SlashCommandBuilder()
    .setName('emojiquiz-reset')
    .setDescription('Resets the whole bot to 0.'),
	async execute(interaction) {
        emojiquiz.interaction = interaction;
        emojiquiz.resetEmojiQuiz();
	}
};