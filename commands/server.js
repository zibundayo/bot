const { SlashCommandBuilder, EmbedBuilder, ChannelType, GuildExplicitContentFilter } = require('discord.js');
 
module.exports = {
  data: new SlashCommandBuilder()
    .setDMPermission(false)
    .setName('server')
    .setDescription('サーバー情報を表示'),
  async execute(interaction) {
    const serwer = interaction.guild;
    const owner = await serwer.fetchOwner().catch(() => null);
    const onlineMembers = serwer.members.cache.filter((member) => member.presence?.status === 'online');
    const { channels, roles } = serwer;
    const sortowaneRole = roles.cache.map(role => role).slice(1, roles.cache.size).sort((a, b) => b.position - a.position);
    const roleUserów = sortowaneRole.filter(role => !role.managed);
    const roleManaged = sortowaneRole.filter(role => role.managed);
    const BoosterCount = serwer.members.cache.filter(member => member.roles.cache.has('1237239722930339850')).size; // Set booster ID role
 
    const maxDisplayRoles = (roles, maxFieldLength = 1024) => {
      let totalLength = 0;
      const result = [];
 
      for (const role of roles) {
        const roleString = `<@&${role.id}>`;
 
        if (roleString.length + totalLength > maxFieldLength) break;
 
        totalLength += roleString.length + 1;
        result.push(roleString);
      }
 
      return result.length;
    };
 
    const allRolesCount = roles.cache.size - 1;
    const getChannelTypeSize = type => channels.cache.filter(channel => type.includes(channel.type)).size;
    const totalChannels = getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildNews, ChannelType.GuildVoice, ChannelType.GuildStageVoice, ChannelType.GuildForum]);
    const verificationLevelMap = {
      [GuildExplicitContentFilter.Disabled]: 'Low',
      [GuildExplicitContentFilter.MembersWithoutRoles]: 'Medium',
      [GuildExplicitContentFilter.AllMembers]: 'Hard',
    };
    const verificationLevel = verificationLevelMap[serwer.explicitContentFilter] || 'Unknown';
 
    const embed = new EmbedBuilder()
      .setColor('#009937')
      .setAuthor({ name: serwer.name, iconURL: serwer.iconURL({ dynamic: true }) })
      .addFields(
        { name: `Server ID:`, value: `└ ${serwer.id}`, inline: true },
        { name: `作成日:`, value: `└ <t:${Math.floor(serwer.createdTimestamp / 1000)}:R>`, inline: true },
        { name: `管理者:`, value: `└ ${owner?.user?.toString() || 'Nie znaleziono właściciela'}`, inline: true },
        { name: `メンバー (${serwer.memberCount})`, value: `└ **${onlineMembers.size}** オンライン\n└ **${BoosterCount}** ブースター `, inline: true },
        { name: `チャンネル (${totalChannels})`, value: `└ **${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildForum, ChannelType.GuildNews])}** テキスト\n└ **${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}** ボイス`, inline: true },
        { name: `その他:`, value: `└ Verification level: **${verificationLevel}**`, inline: true },
        { name: `\`🔐\` Role (${allRolesCount})`, value: `└ **${maxDisplayRoles(roleUserów)}** 普通ロール\n└  **${maxDisplayRoles(roleManaged)}** 管理者ロール` }
      )
      .setThumbnail(serwer.iconURL({ dynamic: true }))
      .setFooter({ text: `招待 by: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
      .setTimestamp();
 
    await interaction.reply({ embeds: [embed] });
  },
};