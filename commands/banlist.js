const { SlashCommandBuilder } = require('@discordjs/builders');

const { EmbedBuilder } = require('discord.js');

const bannedUsers = ['793380855115677778', '998884445815849001'];

module.exports = {

    data: new SlashCommandBuilder()

        .setName('banlist')

        .setDescription('BANされたユーザーを表示'),

    async execute(interaction) {

        const bannedUsers = await interaction.guild.bans.fetch();

        

        const embed = new EmbedBuilder()

            .setColor('#0099ff')

            .setTitle('Banned Users');

        

        if(bannedUsers.size > 0) {

            let bannedUserList = '';

            bannedUsers.forEach(ban => {

                bannedUserList += `${ban.user.tag}\n`;

            });

            embed.setDescription(bannedUserList);

        } else {

            embed.setDescription('まだ誰もBANされていません');

        }

        

        interaction.reply({ embeds: [embed] });

    },

};

