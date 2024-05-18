const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('ユーザーをタイムアウト設定')
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setDescription('ユーザーをタイムアウトします')
            .addUserOption(option => option
                .setName('user')
                .setDescription('タイムアウトするユーザー')
                .setRequired(true))
            .addStringOption(option => option
                .setName('days')
                .setDescription('タイムアウト期間（日）'))
            .addStringOption(option => option
                .setName('hours')
                .setDescription('タイムアウト期間 (時間)'))
            .addStringOption(option => option
                .setName('minutes')
                .setDescription('タイムアウト期間 (分)'))
            .addStringOption(option => option
                .setName('seconds')
                .setDescription('タイムアウト期間 (秒)'))
            .addStringOption(option => option
                .setName('reason')
                .setDescription('タイムアウトの理由')))
        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setDescription('タイムアウトの解除')
            .addUserOption(option => option
                .setName('user')
                .setDescription('タイムアウトを削除するユーザー')
                .setRequired(true)))
        .setDMPermission(false),
    async execute(interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            const embed1 = new EmbedBuilder()
                .setColor('#ffffff')
                .setTitle('Error')
                .setDescription('このコマンドを使用する権限がありません。')
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            return await interaction.reply({ embeds: [embed1], ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'set') {

            const user = interaction.options.getUser('user');
            const days = interaction.options.getString('days');
            const hours = interaction.options.getString('hours');
            const minutes = interaction.options.getString('minutes');
            const seconds = interaction.options.getString('seconds');
            const reason = interaction.options.getString('reason') || 'Not specified';

            const timeMember = await interaction.guild.members.fetch(user.id);

            if (!days && !hours && !minutes && !seconds) {
                const embed2 = new EmbedBuilder()
                    .setColor('#ffffff')
                    .setTitle('Timeout')
                    .setDescription('少なくとも 1 回のオプションを指定する必要があります。')
                    .setTimestamp()
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                return await interaction.reply({ embeds: [embed2], ephemeral: true });
            }

            if (!timeMember) {
                const embed3 = new EmbedBuilder()
                    .setColor('#ffffff')
                    .setTitle('Timeout')
                    .setDescription('言及されたユーザーはサーバーに存在しません。')
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                return await interaction.reply({ embeds: [embed3], ephemeral: true });
            }

            if (interaction.member.id === timeMember.id) {
                const embed5 = new EmbedBuilder()
                    .setColor('#ffffff')
                    .setTitle('Timeout')
                    .setDescription('自分自身でタイムアウトすることはできません。')
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                return await interaction.reply({ embeds: [embed5], ephemeral: true });
            }

            if (!timeMember.kickable) {
                const embed4 = new EmbedBuilder()
                    .setColor('#ffffff')
                    .setTitle('Timeout')
                    .setDescription('このユーザーは、より高いもしくは同じロールを持っているため、タイムアウトできません。')
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                return await interaction.reply({ embeds: [embed4], ephemeral: true });
            }

            if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const embed6 = new EmbedBuilder()
                    .setColor('#ffffff')
                    .setTitle('Timeout')
                    .setDescription('管理者権限を持つスタッフやユーザーをタイムアウトすることはできません。')
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                return await interaction.reply({ embeds: [embed6], ephemeral: true });
            }

            let duration2 = (parseInt(days) || 0) * 86400 + (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
            if (duration2 === 0) {
                const embed7 = new EmbedBuilder()
                    .setColor('#ffffff')
                    .setTitle('Timeout')
                    .setDescription('期間を 0 に指定することはできません。')
                    .setTimestamp()
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                return await interaction.reply({ embeds: [embed7], ephemeral: true });
            }

            let duration = (parseInt(days) || 0) * 86400 + (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
            if (duration > 604800) {
                const embed8 = new EmbedBuilder()
                    .setColor('#ffffff')
                    .setTitle('Timeout')
                    .setDescription('1 週間を超える期間を指定することはできません。')
                    .setTimestamp()
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                return await interaction.reply({ embeds: [embed8], ephemeral: true });
            }

            let displayDays = Math.floor(duration / 86400);
            let displayHours = Math.floor((duration % 86400) / 3600);
            let displayMinutes = Math.floor((duration % 3600) / 60);
            let displaySeconds = duration % 60;

            let durationString = `${displayDays > 0 ? displayDays + ' day' : ''}${displayHours > 0 ? (displayDays > 0 ? ', ' : '') + displayHours + ' hour' : ''}${displayMinutes > 0 ? (displayDays > 0 || displayHours > 0 ? ', ' : '') + displayMinutes + ' minute' : ''}${displaySeconds > 0 ? (displayDays > 0 || displayHours > 0 || displayMinutes > 0 ? ', ' : '') + displaySeconds + ' second' : ''}`;

            await timeMember.timeout(duration * 1000, reason);

            const embed9 = new EmbedBuilder()
                .setColor('#ffffff')
                .setTitle('Timeout')
                .setDescription(`${user} をタイムアウトしました`)
                .addFields(
                    { name: 'Duration', value: durationString, inline: true},
                    { name: 'Reason', value: reason, inline: true }
                )
                .setTimestamp()
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
            return await interaction.reply({ embeds: [embed9] });

        }

        if (subcommand === 'remove') {

            const user = interaction.options.getUser('user');

            const timeMember = await interaction.guild.members.fetch(user.id);

            if (!timeMember) {
                const embed10 = new EmbedBuilder()
                    .setColor('#ffffff')
                    .setTitle('Timeout')
                    .setDescription('このユーザーはいません')
                    .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                    .setTimestamp();

                return await interaction.reply({ embeds: [embed10], ephemeral: true });
            }

            await timeMember.timeout(null);

            const embed11 = new EmbedBuilder()
                .setColor('#ffffff')
                .setTitle('Timeout')
                .setDescription(` ${user} のタイムアウトを解除しました`)
                .setTimestamp()
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
            return await interaction.reply({ embeds: [embed11] });
        }
    }
};