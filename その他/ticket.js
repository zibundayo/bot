const { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = (client) => {  

  client.on('messageCreate', async message => {

    if (message.content.startsWith('!ticket')) {

        const args = message.content.split(' ');

        args.shift(); // Remove the command (!ticket)

      

          if (!message.member.permissions.has('ADMINISTRATOR')) return;

    

　　　　　if (args.length < 2) {

            await message.channel.send('使用方法: !ticket <タイトル> <オプション1> <オプション2> ...');

            return;

        }

      

       　const title = args.shift(); 

        const options = args.map(arg => ({

            label: arg,

            value: arg.toLowerCase().replace(/\s+/g, '_') // Convert to lowercase and replace spaces with underscores for value

        }));

        const row = new ActionRowBuilder()

            .addComponents(

                new StringSelectMenuBuilder()

                    .setCustomId('create_ticket')

                    .setPlaceholder('チケットを選択')

                    .addOptions(options)

            );

        const embed = new EmbedBuilder()

            .setColor('#0099ff')

            .setTitle(title)

            .setDescription('メニューからチケットを選択してください');

        await message.channel.send({ embeds: [embed], components: [row] });

    }

});

client.on('interactionCreate', async interaction => {

    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === 'create_ticket') {

        const selectedTicket = interaction.values[0];

        const guild = interaction.guild;

        const member = interaction.member;

        const category = guild.channels.cache.find(c => c.type === 'GUILD_CATEGORY' && c.name === 'Tickets');

        const ticketChannel = await guild.channels.create({

            name: `${selectedTicket}-${member.user.username}`,

            type: ChannelType.GUILD_TEXT,

            permissionOverwrites: [

                {

                    id: guild.roles.everyone,

                    deny: ['ViewChannel']

                },

                {

                    id: member.id,

                    allow: ['ViewChannel']

                }

            ]

        });

const ticketEmbed = new EmbedBuilder()

    .setColor('#ff0000')

    .setTitle('Ticket Created')

    .setDescription(`Ticket created by ${member.user.tag}`)

    .addFields(

        { name: 'Ticket ID', value: ticketChannel.id }

    );

await ticketChannel.send({ embeds: [ticketEmbed] });

        const closeRow = new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()

                    .setCustomId('close_ticket')

                    .setLabel('チケットを閉じる')

                    .setStyle('4')

            );

      

        const ticketMessage = await ticketChannel.send({ content: '', components: [closeRow] });

        await interaction.reply({ content: `チケットを作成しました: ${ticketChannel}`, ephemeral: true });

    }

});

client.on('interactionCreate', async interaction => {

    if (!interaction.isButton()) return;

    if (interaction.customId === 'close_ticket') {

        await interaction.message.channel.delete();

    }

    });

};