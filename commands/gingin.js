const { SlashCommandBuilder } = require('discord.js');

const ALLOWED_USER_ID = '1132844184093589514'; // 指定されたユーザーID

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gingingila')
    .setDescription('gingin専用聞き専コマンド')
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('件数')
        .setRequired(true)),
  async execute(interaction) {
    // ユーザーIDのチェック
    if (interaction.user.id !== ALLOWED_USER_ID) {
      return interaction.reply({ content: 'gingin専用聞き専コマンドです', ephemeral: true });
    }

    const count = interaction.options.getInteger('count');

    if (count < 1 || count > 100) {
      return interaction.reply({ content: '1~100を選択してください', ephemeral: true });
    }

    try {
      const messages = await interaction.channel.bulkDelete(count, true);
      return interaction.reply({ content: `${messages.size}件の消去完了`, ephemeral: true });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'エラー', ephemeral: true });
    }
  },
};
