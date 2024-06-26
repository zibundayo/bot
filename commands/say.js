const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('言う')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('test')
        .setRequired(true)),
  async execute(interaction) {
    const message = interaction.options.getString('message');
    await interaction.reply(message);
  },
};