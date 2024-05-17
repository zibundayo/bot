const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('ユーザーの情報を送信します')
    .addUserOption(option =>
            option
                .setName('user')
                .setDescription('情報を取得したいユーザー')),
async execute(interaction, client) {
  const user = interaction.options.getUser('user') || interaction.user
  const joinedDate = new Date(interaction.guild.members.cache.get(user.id).joinedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const createdDate = new Date(user.createdAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  const nickname = interaction.guild.members.cache.get(user.id).nickname || 'なし';
  const user_embed = new EmbedBuilder()
    .setColor('#F8C972')
    .setTitle(`${user.displayName}`)
    .addFields(
              { name: 'ユーザーID', value: `${user.id}` },
              { name: '参加日', value: `${joinedDate}` },
              { name: '作成日', value: `${createdDate}`},
              { name: 'ニックネーム', value: `${nickname}` },
              { name: 'ユーザーネーム', value: `${user.username.replace('_', '\\_')}`},
      )
    .setThumbnail(`${user.displayAvatarURL()}`)
  interaction.reply({ embeds:[user_embed]})
    },
};