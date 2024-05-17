const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('ユーザー')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('ユーザーのアバターを表示します')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const avatarEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${user.username}のアバター`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 4096 }));

        await interaction.reply({ embeds: [avatarEmbed] });
    },
};
