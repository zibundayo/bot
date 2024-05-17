const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
module.exports = {
	data: new SlashCommandBuilder()
        // コマンドの名前
		.setName('join')
        // コマンドの説明文
		.setDescription('VCに参加。')
		// コマンドのオプションを追加
        // 今回はチャンネルを選ばせたいので、addChannelOptionを使用
		.addChannelOption((option) =>
			option
                // optionの名前
				.setName('channel')
                // optionの説明
				.setDescription('ボイスチャンネルに参加')
               // optionが必須かどうか
				.setRequired(true)
               // チャンネルのタイプをVCに指定
				.addChannelTypes(ChannelType.GuildVoice),
		),
	async execute(interaction) {
		const voiceChannel = interaction.options.getChannel('channel');
        // VCに参加する処理
		const connection = joinVoiceChannel({
			guildId: interaction.guildId,
			channelId: voiceChannel.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});
		await interaction.reply('参加しました！');
	},
};