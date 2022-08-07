const { SlashCommandBuilder } = require('discord.js');
const { emojiquiz } = require('../db.js');
module.exports = {
	data: new SlashCommandBuilder()
    .setName('emojiquiz-delete')
    .setDescription('Finds and deletes emojiquiz out of the db.')
    .addStringOption(option =>
    option.setName('emoji')
    .setDescription('Enter the emoji.')
    .setRequired(true)),
	async execute(interaction) {
        if (interaction.member.roles.cache.some(role => role.name === 'Perms') || interaction.member.permissions.has([PermissionFlagsBits.Administrator])) {
		const emojiquiz_delete = await interaction.options.getString('emoji');
        emojiquiz.interaction = interaction;
        emojiquiz.delete = emojiquiz_delete;
        emojiquiz.deleteEmojiQuiz();
    } else {
        await interaction.reply({content:"**You have no permission! 😢**", ephemeral: true});
    }
	}
    
};