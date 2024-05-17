const { SlashCommandBuilder , EmbedBuilder } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('ボットが入っているすべてのサーバーを表示'),
  async execute(interaction) {
    const guilds = interaction.client.guilds.cache.map(guild => ({
      name: guild.name,
      memberCount: guild.memberCount,
    }));
    let description = '';
    guilds.forEach(guild => {
      description += `**${guild.name}** - ${guild.memberCount} members\n`;
    });
    const embed = new EmbedBuilder()
      .setTitle('サーバー情報')
      .setDescription(description)
      .setColor(0x00FF00);
    await interaction.reply({ embeds: [embed] });
  },
};
