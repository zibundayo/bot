const { Events } = require("discord.js");
module.exports = (client) => {
//消すな！
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    const { guild, member } = interaction;
    const roleId = interaction.customId;
    const role = guild.roles.cache.get(roleId);
    if (!role) return;
    if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
        await interaction.reply({ content: `役職 ${role.name} を削除しました`, ephemeral: true });
    } else {
        await member.roles.add(roleId);
        await interaction.reply({ content: `役職 ${role.name} を付与しました`, ephemeral: true });
   }
  });
};