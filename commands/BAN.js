const { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
 
 
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('ユーザーをBANします')
    .setDMPermission(false)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('user')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('理由')
        .setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || '正常にBANしました';
    let guild = await interaction.guild.fetch();
    const permEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('Invalid Permission')
      .setDescription(`コマンドを使う権限がありません`)
      .setTimestamp()
      .setFooter({ text: 'Bot made by zibukasu' });
    const unableEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setDescription(` DMに送信できません ${target.tag}`)
      .setTimestamp()
      .setFooter({ text: 'Bot made by zibukasu' });
    const banEmbed = new EmbedBuilder()
      .setColor(0x05fc2a)
      .setDescription(` Banned **${target.tag}** | **${reason}**. `)
      .setTimestamp()
      .setFooter({ text: 'Bot made by zibukasu' });
    const failbanEmbed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setDescription(` Failed to ban **${target.tag}**. `)
      .setTimestamp()
      .setFooter({ text: 'Bot made by zibukasu' });
    const perm = interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers);
    if (!perm)
      return await interaction.channel.sendTyping(),
        interaction.reply({ embeds: [permEmbed], ephemeral: true });

 
    let ban = await guild.members.ban(target, { reason: `${interaction.user.tag} - ${reason}` }).catch((err) => { console.log("Error with Ban command: " + err) })
    if (ban) {
      await interaction.channel.sendTyping(),
        await interaction.reply({ embeds: [banEmbed] })
    } else if (!ban) {
      interaction.reply({ embeds: [failbanEmbed] })
    }
  }
}