const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`remind`)
    .setDescription(`リマインダー/特定のタスクを実行するように通知するタイマー。`)
    .addStringOption(opt => opt.setName(`description`).setDescription(`リマインドしてもらいたいタスク。`).setRequired(true))
    .addStringOption(opt => opt.setName(`time`).setDescription(`時間`)
    .addChoices(
        { name: '1 分', value: '60'},
        { name: '2 分', value: '120'},
        { name: '5 分', value: '300'},
        { name: '10 分', value: '600'},
        { name: '15 分', value: '900'},
        { name: '20 分', value: '1200'},
        { name: '30 分', value: '1800'},
        { name: '45 分', value: '2700'},
        { name: '1 時間', value: '3600'},
        { name: '2 時間', value: '7200'},
        { name: '3 時間', value: '10800'},
        { name: '4 時間', value: '14400'},
        { name: '5 時間', value: '18000'},
        { name: '6 時間', value: '21600'},
        { name: '7 時間', value: '25200'},
        { name: '8 時間', value: '28800'},
        { name: '9 時間', value: '32400'},
        { name: '10 時間', value: '36000'},
        { name: '15 時間', value: '54000'},
        { name: '20 時間', value: '72000'},
        { name: '22 時間', value: '79200'},
        { name: '24 時間', value: '86400'}
    ).setRequired(true)),
    async execute (interaction) {
        const desc = interaction.options.getString(`description`)
        const time = interaction.options.getString(`time`)
        const channel = interaction.channel

        const embed = new EmbedBuilder()
        .setColor(`Red`)
        .setTitle(`タイマー`)
        .setDescription(`リマインダーを設定しました:\n\`\`\`Time: ${time} (Seconds) | Task: ${desc}\`\`\``)


        const remindEmbed = new EmbedBuilder()
        .setColor(`Blue`)
        .setTitle(`タイマー`)
        .setDescription(`時間です！: **${desc}**`)


        await interaction.reply({ embeds: [embed]})

        setTimeout(async () => {
            await channel.send({ content: `<@${interaction.user.id}>`, embeds: [remindEmbed]})
        }, time*1000) 

    }
}