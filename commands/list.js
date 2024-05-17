
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('サーバーの役職をリストします。'),
    async execute(interaction) {
        const guild = interaction.guild;
        
        if (!guild) return;

        const roles = guild.roles.cache.map(role => role);

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Server Roles')
            .setDescription('このサーバーの役職の一覧:')
            .addFields(
                roles.map(role => {
                    return {
                        name: role.name,
                        value: `ID: ${role.id}`,
                        inline: true
                    };
                })
            );

        await interaction.reply({ embeds: [embed] });
    },
};