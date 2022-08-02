const { SlashCommandBuilder } = require('discord.js');
const { emojiquiz } = require('../db.js');
module.exports = {
	data: new SlashCommandBuilder()
    .setName('emojiquiz-setup')
    .setDescription('Setups the emojiquiz')
    .addChannelOption(option =>
    option.setName('channel')
    .setDescription('Select the channel where the emojiquiz should be sent to.')
    .setRequired(true)),
	async execute(interaction) {
		const emojiquiz_channel = await interaction.options.getChannel('channel');
        emojiquiz.channel = emojiquiz_channel;
        emojiquiz.interaction = interaction;
        emojiquiz.setup();

	},
};