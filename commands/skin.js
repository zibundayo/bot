const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skin')
        .setDescription('指定したMinecraftユーザーのスキンを表示します。')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Minecraftユーザー名')
                .setRequired(true)),
    async execute(interaction) {
        const minecraftUsername = interaction.options.getString('username');

      
            // メンションされたユーザーのIDからユーザーオブジェクトを取得し、そのユーザー名を使用する
        let username;
        if (minecraftUsername.startsWith('<@') && minecraftUsername.endsWith('>')) {
            const userId = minecraftUsername.substring(3, minecraftUsername.length - 1);
            username = (await interaction.guild.members.fetch(userId)).user.username;
        } else {
            username = minecraftUsername;
        }
      
        const embed = new EmbedBuilder()
            .setTitle(`${minecraftUsername}のスキン`)
            .setImage(`https://minotar.net/armor/body/${minecraftUsername}/100.png?overlay`)
            .setThumbnail(`https://minotar.net/skin/${minecraftUsername}`)
            .setColor('#0099ff');

        await interaction.reply({ embeds: [embed] });
    },
};
