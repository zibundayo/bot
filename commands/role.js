const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder , ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('指定した役職を割り当てます。')
        .addStringOption(option =>
            option.setName('roles')
                .setDescription('割り当てる役職の名前をスペースで区切って入力してください。')
                .setRequired(true)),
    async execute(interaction) {
        // 管理者以外はコマンドを実行できないようにする
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'このコマンドは管理者のみが実行できます。', ephemeral: true });
        }

        const roleNames = interaction.options.getString('roles').split(' ');
        const rolePanelRow = new ActionRowBuilder();

        for (const roleName of roleNames) {
            const role = interaction.guild.roles.cache.find(role => role.name === roleName);

            if (!role) {
                return interaction.reply({ content: `指定された役職 "${roleName}" が見つかりませんでした。`, ephemeral: true });
            }

            const button = new ButtonBuilder()
                .setCustomId(role.id)
                .setLabel(role.name)
                .setStyle('1');

            rolePanelRow.addComponents(button);
        }

        const embed = new EmbedBuilder()
            .setTitle('役職を選択してください:')
            .setColor('#0099ff');

        await interaction.reply({ embeds: [embed], components: [rolePanelRow] });
    },
};
