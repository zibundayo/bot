const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('pingを送信'),

    async execute(interaction) {

        const circles = {
            good: '<:High:1236973636481712128>',  
            okay: '<:Mid:1236973632769495102>',
            bad: ':<Low:1236973634518646814>',
        };


        await interaction.deferReply();

        const startTimestamp = Date.now(); 


        const ws = interaction.client.ws.ping;


        const msgEdit = Date.now() - startTimestamp;


        let days = Math.floor(interaction.client.uptime / 86400000);
        let hours = Math.floor(interaction.client.uptime / 3600000) % 24;
        let minutes = Math.floor(interaction.client.uptime / 60000) % 60;
        let seconds = Math.floor(interaction.client.uptime / 1000) % 60;


        const wsEmoji = ws <= 100 ? circles.good : ws <= 200 ? circles.okay : circles.bad;
        const msgEmoji = msgEdit <= 200 ? circles.good : circles.bad;


        const pingEmbed = new EmbedBuilder()
            .setThumbnail(interaction.client.user.displayAvatarURL({ size: 64 }))
            .setColor('Blue')
            .setTimestamp()
            .setFooter({ text: `Pinged At` })
            .addFields(
                { name: 'Websocket Latency', value: `${wsEmoji} \`${ws}ms\`` },
                { name: 'API Latency', value: `${msgEmoji} \`${msgEdit}ms\`` },
                { name: `${interaction.client.user.username} Uptime`, value: `:clock: \`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds\`` }
            );


        const refreshButton = new ButtonBuilder()
            .setCustomId('refresh_ping')
            .setLabel('Refresh')
            .setStyle(ButtonStyle.Primary);

        const actionRow = new ActionRowBuilder().addComponents(refreshButton);


        await interaction.editReply({ embeds: [pingEmbed], components: [actionRow] });


        const filter = i => i.customId === 'refresh_ping' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'refresh_ping') {

                const newWs = interaction.client.ws.ping;
                const newMsgEdit = Date.now() - startTimestamp;

                pingEmbed.setFields(
                    { name: 'Websocket Latency', value: `${wsEmoji} \`${newWs}ms\`` },
                    { name: 'API Latency', value: `${msgEmoji} \`${newMsgEdit}ms\`` },
                    { name: `${interaction.client.user.username} Uptime`, value: `:clock: \`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds\`` }
                );

                await i.update({ embeds: [pingEmbed] });
            }
        });

        collector.on('end', collected => {
            actionRow.components.forEach(component => component.setDisabled(true));
            interaction.editReply({ components: [actionRow] }); 
        });
    },
};
