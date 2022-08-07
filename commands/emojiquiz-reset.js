const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { emojiquiz } = require('../db.js');
module.exports = {
	data: new SlashCommandBuilder()
    .setName('emojiquiz-reset')
    .setDescription('Resets the whole bot to 0.'),
	async execute(interaction) {
        if (interaction.member.roles.cache.some(role => role.name === 'Perms') || interaction.member.permissions.has([PermissionFlagsBits.Administrator])) {
        emojiquiz.interaction = interaction;
        emojiquiz.resetEmojiQuiz();
    } else {
        await interaction.reply({content:"**You have no permission! 😢**", ephemeral: true});
    }
	}
};