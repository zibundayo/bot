const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('利用可能なコマンドの一覧を表示します。'),
    async execute(interaction) {
        const embed1 = new EmbedBuilder()
            .setTitle('コマンド一覧 - ページ 1')
            .setDescription('コマンド一覧:')
            .addFields(
                { name: 'ping', value: 'Pongを返します' },
                { name: 'ggrks', value: 'Googleで単語を検索します' },
                { name: 'server', value: 'サーバー情報を表示します' },
                { name: 'user', value: '指定したユーザーの情報を表示します' },
                { name: 'skin', value: 'Minecraftのスキンを表示します' },
                { name: 'say', value: 'BOTに喋らせます、それだけ' },
                { name: 'banlist', value: 'BANされたユーザーを表示' },
                { name: 'list', value: 'サーバーの役職のリストを表示します' }
              　
            )
            .setColor('#0099ff');

        const embed2 = new EmbedBuilder()
            .setTitle('コマンド一覧 - ページ 2')
            .setDescription('コマンド一覧:')
            .addFields(
                { name: 'role', value: 'ロールパネルを作成します' },
                { name: 'avatar', value: 'ユーザーのアイコンを表示' },
                { name: 'BAN', value: 'ユーザーをBANします' },
                { name: 'timer', value: 'タイマーをセットします' },
                { name: 'timeout', value: 'ユーザーをタイムアウトします' },
                { name: 'play', value: 'VCで指定した音楽を再生します※自動でVCから抜けません' },
                { name: 'purge', value: 'ユーザーのメッセージを消去します' },
                { name: 'join', value: '指定したボイスチャンネルに参加します' },
                { name: 'leave', value: 'ボイスチャンネルから退席します' },
                // 追加のコマンドをここに追加
            )
            .setColor('#0099ff');

        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous_page')
                    .setLabel('前のページへ')
                    .setStyle('1')
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('next_page')
                    .setLabel('次のページへ')
                    .setStyle('1')
            );

        await interaction.reply({ embeds: [embed1], components: [row2] });

        const filter = i => i.user.id === interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'next_page') {
                await i.update({ embeds: [embed2], components: [row1] });
            } else if (i.customId === 'previous_page') {
                await i.update({ embeds: [embed1], components: [row2] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: '15秒以内にページングボタンを押さなかったため、操作はキャンセルされました。', components: [] });
            }
        });
    },
};
