const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('ユーザーのバナーを表示します')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('バナーを表示するユーザー')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const guildMember = await interaction.guild.members.fetch(user.id);
        const userBanner = await guildMember.user.fetch();
        const bannerURL = userBanner.bannerURL({ format: 'png', size: 1024 });
        if (bannerURL) {
            const embed = new EmbedBuilder()
                .setTitle(`${user.username}のバナー`)
                .setImage(bannerURL)
                .setColor('#0099ff');
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply('このユーザーはバナーを持っていません。');
        }
    },
};
