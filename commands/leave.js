const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('ボイスチャンネルから退出します。'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);

        if (connection) {
            connection.destroy();
        await interaction.reply(`ボイスチャンネルから退席しました`);
        } else {
            interaction.reply('ボットは現在ボイスチャンネルに参加していません。');
        }
    },
};
