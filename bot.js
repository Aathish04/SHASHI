// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config()

const token = process.env.DISCORD_TOKEN

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(
    Events.ClientReady,
    readyClient => {
        readyClient.user.setActivity({name:"The Waiting Game",type:0});
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

// Log in to Discord with your client's token
client.login(token);