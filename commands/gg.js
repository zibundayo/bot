const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const axios = require('axios');

const cheerio = require('cheerio');

module.exports = {

    data: new SlashCommandBuilder()

        .setName('ggrks')

        .setDescription('Googleで指定された単語を検索します')

        .addStringOption(option =>

            option.setName('query')

                .setDescription('検索したい単語')

                .setRequired(true)),

    async execute(interaction) {

        const query = interaction.options.getString('query');

        const searchImageUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;

        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

        try {

            const { data } = await axios.get(searchImageUrl, {

                headers: {

                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'

                }

            });

            const $ = cheerio.load(data);

            // 検索結果の画像URLを取得

            let imageUrl = '';

            $('img').each((i, el) => {

                const src = $(el).attr('src');

                const dataSrc = $(el).attr('data-src');

                if (dataSrc && dataSrc.startsWith('http')) {

                    imageUrl = dataSrc;

                    return false; // ループを終了

                } else if (src && src.startsWith('http')) {

                    imageUrl = src;

                    return false; // ループを終了

                }

            });

            if (imageUrl) {

                const embed = new EmbedBuilder()

                    .setTitle(`「${query}」の検索結果`)

                    .setDescription(`${query}の画像`)

                    .setURL(searchUrl)

                    .setImage(imageUrl);

                await interaction.reply({ embeds: [embed] });

            } else {

                await interaction.reply('画像が見つかりませんでした。');

            }

        } catch (error) {

            console.error(error);

            await interaction.reply('検索中にエラーが発生しました。');

        }

    },

};

