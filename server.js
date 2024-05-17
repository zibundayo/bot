const fs = require("node:fs");
const path = require("node:path");
const {Client,Collection,StringSelectMenuBuilder, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus,ContextMenuCommandBuilder,StringSelectMenuOptionBuilder, MessageManager, Portials, PermissionsBitField, Embed, ChannelType, Permissions, GuildMember, GuildHubType, AuditLogEvent, ButtonBuilder, ActionRowBuilder, DMChannel, InteractionCollector, Partials, ButtonStyle, ActivityType, Intents, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, enableValidators ,EmbedBuilder,Events,GatewayIntentBits,MessagePayloadBuilder,AttachmentBuilder} = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessages], partials: Object.values(Partials), }); 


// 読み込み
const messageEventsPath = path.join(__dirname, "その他");
const messageEventFiles = fs.readdirSync(messageEventsPath).filter((file) => file.endsWith(".js"));

// 処理
messageEventFiles.forEach((file) => {
  const messageEvent = require(path.join(messageEventsPath, file));
  messageEvent(client);
});





///////////////////////////////////////////////////////////////



const { createCanvas, loadImage } = require('canvas');


// サーバーごとの設定を保存するJSONファイルのパス
const settingsFilePath = 'settings.json';

// ファイルから設定を読み込み
let serverSettings = loadSettingsFromFile();

client.on('messageCreate', async message => {
    // メッセージが送信されたチャンネルがDMかどうかを確認
    if (!message.guild) return;


    // メッセージが "!setwelcomemessage [チャンネルID] [歓迎メッセージ]" コマンドかどうかを確認
    if (message.content.startsWith('!setwelcome')) {
        // コマンドの引数を取得
        const args = message.content.slice('!setwelcome'.length).trim().split(/ +/);
        const channelId = args.shift();
        const welcomeMessage = args.join(' ');

        // チャンネルを取得
        const channel = message.guild.channels.cache.get(channelId);

        // チャンネルが存在するか確認
        if (!channel) {
            message.reply('指定されたチャンネルが見つかりません。');
            return;
        }

        // サーバーごとの設定を保存
        serverSettings[message.guild.id] = { channel: channelId, message: welcomeMessage };
        saveSettingsToFile();

        message.reply(`サーバーの歓迎メッセージを ${channel} に設定しました：${welcomeMessage}`);
    }

    // メッセージが "!setwelcomeimage [画像のURL]" コマンドかどうかを確認
    if (message.content.startsWith('!setimage')) {
        // コマンドの引数を取得
        const args = message.content.slice('!setimage'.length).trim().split(/ +/);
        const imageUrl = args.shift();

        // サーバーごとの設定を取得または作成
        let settings = serverSettings[message.guild.id];
        if (!settings) {
            settings = {};
            serverSettings[message.guild.id] = settings;
        }

        // 背景画像のURLを保存
        settings.imageUrl = imageUrl;
        saveSettingsToFile();

        message.reply(`サーバーの背景画像を設定しました：${imageUrl}`);
    }
});

client.on('guildMemberAdd', async member => {
    // サーバーごとの設定を取得
    const settings = serverSettings[member.guild.id];

    // サーバーごとの設定が存在しない場合はデフォルトの設定を使用
    if (!settings) {
        console.log(`サーバー ${member.guild.name} には設定がありません。`);
        return;
    }

    // メンバーのアイコンを合成した画像を送信
    sendWelcomeImage(member, settings.message, settings.channel, settings.imageUrl);
});

async function sendWelcomeImage(member, welcomeMessage, channelId, imageUrl) {
    // チャンネルを取得
    const channel = member.guild.channels.cache.get(channelId);

    // チャンネルが存在するか確認
    if (!channel) {
        console.log('指定されたチャンネルが見つかりません。');
        return;
    }

    // Canvasを作成
    const canvas = createCanvas(500, 600);
    const ctx = canvas.getContext('2d');

    // 背景画像を読み込む
    const backgroundImage = await loadImage(imageUrl || 'https://cdn.glitch.global/7ee9e92b-0453-4b91-9612-61aa1af8da83/file%20(2).png?v=1715500303402');
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

              const memberAvatar = await loadImage(member.user.displayAvatarURL({size:128}).replace('.webp', '.png'));
            // アイコンをCanvasに描画
            ctx.drawImage(memberAvatar, 30, 30, 150, 150);


    // 歓迎メッセージを描画
    ctx.font = '30px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(welcomeMessage || '', 200, 100);

    // Canvasを画像として添付
    const attachment = new AttachmentBuilder(canvas.toBuffer(), 'welcome-image.png');

    // 歓迎メッセージを送信
    channel.send({ content: `${member.user.username} さん、ようこそ！`, files: [attachment] });
}

// ファイルから設定を読み込み
function loadSettingsFromFile() {
    try {
        const data = fs.readFileSync(settingsFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('設定ファイルを読み込めませんでした。新しいファイルを作成します。');
        return {};
    }
}

// 設定をファイルに保存
function saveSettingsToFile() {
    try {
        const data = JSON.stringify(serverSettings, null, 2);
        fs.writeFileSync(settingsFilePath, data);
        console.log('設定がファイルに保存されました。');
    } catch (error) {
        console.error('設定をファイルに保存できませんでした。');
    }
}




////////////////////////////////////////////////////////////////







// JSONファイルのパス
const filePath = 'words.json';

// 単語とその意味を格納するマップ
let wordMap = new Map();

// JSONファイルからデータを読み込む
fs.readFile(filePath, (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    try {
        wordMap = new Map(JSON.parse(data));
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});

// 単語マップをJSONファイルに書き込む
function saveWords() {
    fs.writeFile(filePath, JSON.stringify(Array.from(wordMap.entries())), err => {
        if (err) {
            console.error('Error writing file:', err);
        }
    });
}

client.on('messageCreate', message => {
    if (!message.content.startsWith('!z') || message.author.bot) return;

    const args = message.content.slice(3).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'add') {
        const word = args[0];
        const meaning = args.slice(1).join(' ');

        if (!word || !meaning) {
            return message.reply('Usage: !z add <word> <meaning>');
        }

        wordMap.set(word.toLowerCase(), meaning);
        saveWords(); // 変更を保存する
        message.reply(`追加 ${word}`);
    } else if (command === 'word') {
        const word = args[0];
        if (!word) {
            return message.reply('Usage: !z word <word>');
        }

        const meaning = wordMap.get(word.toLowerCase());
        if (!meaning) {
            return message.reply('Word not found.');
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${word}`)
            .setDescription(meaning);
        message.channel.send({ embeds: [embed] });
    } else if (command === 'wordlist') {
        const wordList = Array.from(wordMap.keys()).join(', ');
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('単語リスト')
            .setDescription(wordList);
        message.channel.send({ embeds: [embed] });
    }
});




 




client.login(process.env.TOKEN);