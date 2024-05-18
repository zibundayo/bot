// commands/play.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { entersState, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

// ループ再生状態を管理するためのMap
const loopStates = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('YouTubeの音楽を再生します。')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('YouTubeの動画URLを入力してください。')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('loop')
                .setDescription('曲をループ再生します。')),

    async execute(interaction) {
        const url = interaction.options.getString('url');
        if (!ytdl.validateURL(url)) return interaction.reply(`${url}は処理できません。`);

        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('先にボイスチャンネルに参加してください！');

        const connection = joinVoiceChannel({
            adapterCreator: channel.guild.voiceAdapterCreator,
            channelId: channel.id,
            guildId: channel.guild.id,
            selfDeaf: true,
            selfMute: false,
        });
        const player = createAudioPlayer();
        connection.subscribe(player);

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title;

        const stream = ytdl(url, {
            filter: format => format.audioCodec === 'opus' && format.container === 'webm',
            quality: 'highest',
            highWaterMark: 32 * 1024 * 1024,
        });

        // ループ再生オプションの値を取得し、ループ状態を更新
        const loopEnabled = interaction.options.getBoolean('loop');
        loopStates.set(interaction.guildId, loopEnabled);

        // 曲が終了した時の処理
        player.on(AudioPlayerStatus.Idle, async () => {
            const loopState = loopStates.get(interaction.guildId);
            if (loopState) {
                // ループ再生が有効な場合は再生するリソースを再登録
                const stream = ytdl(url, {
                    filter: format => format.audioCodec === 'opus' && format.container === 'webm',
                    quality: 'highest',
                    highWaterMark: 32 * 1024 * 1024,
                });
                const resource = createAudioResource(stream, {
                    inputType: StreamType.WebmOpus,
                    metadata: {
                        title: title,
                    },
                });
                player.play(resource);
            } else {
                // ループ再生が無効な場合は接続を解除
                connection.destroy();
            }
        });

        // 最初の再生
        const resource = createAudioResource(stream, {
            inputType: StreamType.WebmOpus,
            metadata: {
                title: title,
            },
        });
        player.play(resource);

        await interaction.reply(`${title}の再生を開始しました。`);
    },
};
