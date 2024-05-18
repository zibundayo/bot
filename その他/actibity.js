const { Events, ActivityType } = require("discord.js");

module.exports = (client) => {

  client.once(Events.ClientReady, () => {

    console.log(`Ready! Logged in as ${client.user.tag}`);

    // Function to update presence with total user count and guild count

    const updatePresence = () => {

      let totalUserCount = client.guilds.cache.reduce((acc, guild) => acc + (guild.memberCount || 0), 0); // Ensure `memberCount` is not undefined

      client.user.setPresence({

        activities: [

          {

            type: ActivityType.Watching,

            name: `${totalUserCount} 人 | ${client.guilds.cache.size} サーバー`,

          },

        ],

        status: "online",

      });

    };

    // Initial presence update

    updatePresence();

    // Optionally, update presence periodically (e.g., every 5 minutes)

    setInterval(updatePresence, 5 * 60 * 1000); // 5 minutes

  });

};

