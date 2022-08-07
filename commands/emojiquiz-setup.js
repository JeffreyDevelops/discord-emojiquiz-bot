const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { emojiquiz } = require('../db.js');
module.exports = {
	data: new SlashCommandBuilder()
    .setName('emojiquiz-setup')
    .setDescription('Setups the emojiquiz')
    .addChannelOption(option =>
    option.setName('channel')
    .setDescription('Select the channel where the emojiquiz should be sent to.')
    .setRequired(true))
    .addChannelOption(option =>
        option.setName('pending_channel')
        .setDescription('Select channel where new emojiquiz suggestion should be sent to.')
        .setRequired(true)),
	async execute(interaction) {
        if (interaction.member.roles.cache.some(role => role.name === 'Perms') || interaction.member.permissions.has([PermissionFlagsBits.Administrator])) {
		const emojiquiz_channel = await interaction.options.getChannel('channel');
        const emojiquiz_pending = await interaction.options.getChannel('pending_channel');
        let bot = interaction.member.guild.members.cache.find(user => user.user.username === "Emojiquiz");
        const check_if_perm = bot.permissions.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages || PermissionFlagsBits.Administrator]);
        if (check_if_perm === false) {
    const embed = new EmbedBuilder()
            .setTitle('__Emojiquiz-System__')
            .setColor('#FFFFFF')
            .setDescription(`You need to enable the following permissions to get the bot to work:\n\n`+
            `**VIEW CHANNEL**, **SEND MESSAGES**, **MANAGE MESSAGES**\n\n`+
            `Alternative: If you trust the bot you can enable **ADMINISTRATOR** to get full access.`);
            try {
                await interaction.reply({embeds: [embed], ephemeral: true});
            } catch (error) {
                return;
            }
    return
}

    if(!emojiquiz_channel.isTextBased()) {
        return interaction.reply({
            content: 'Selected channel is not text-based. :x:',
            ephemeral: true
        });
    }

    
        emojiquiz.pending_channel = emojiquiz_pending;
        emojiquiz.channel = emojiquiz_channel;
        emojiquiz.interaction = interaction;
        emojiquiz.setup();
    } else {
        await interaction.reply({content:"**You have no permission! 😢**", ephemeral: true});
    }
	}
};