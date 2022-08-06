const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { emojiquiz } = require('../db.js');
module.exports = {
	data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Helps you to navigate through the bot commands.'),
	async execute(interaction) {
        const embed = new EmbedBuilder()
        .setTitle(`**Emojiquiz** 🥳🤳😎`)
        .setColor('#FF8800')
        .setDescription(`/emojiquiz-create\nCreates emojiquiz.\n\n/emojiquiz-setup\nSetups the emojiquiz.\n\n/emojiquiz-delete\nFinds and deletes emojiquiz out of the db.\n\n/emojiquiz-reset\nResets the whole bot to 0.`)
        .setFooter({ text: 'Emojiquiz', iconURL: `https://i.imgur.com/OHN3crW.png` });
        try {
            await interaction.reply({embeds: [embed], ephemeral: true});
        } catch (error) {
            return;
        }
        
	}
    
};