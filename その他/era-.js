const { Events,Collection } = require("discord.js");

const fs = require("node:fs");

const path = require("node:path");

module.exports = (client) => {

  client.commands = new Collection();

  const commandsPath = path.join(__dirname, "..", "commands");

  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {

    const filePath = path.join(commandsPath, file);

    const command = require(filePath);

    client.commands.set(command.data.name, command);

  }

  // Discordからコマンドを受け取り、それに応じた処理を行う

  client.on(Events.InteractionCreate, async (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {

      await command.execute(interaction);

    } catch (error) {

      console.error(error);

      await interaction.reply({

        content: "エラーもしくは権限がありません",

        ephemeral: true,

      });

    }

  });

};

