const { Events, CompressionMethod } = require('discord.js');
const infer = import('../infer.mjs');
const firebaseutils = import("../firebase.mjs");

async function queryLLMAndGetResponse({ message, prompt }) {
    // console.log(message)
    let oldhistory = await (await firebaseutils).getServerChannelUserHistory(message.guildId, message.channelId, message.author.id)
    let session = new (await infer).LlamaChatSessionWithHistory({ username: message.author.username, history:oldhistory})
    response = await session.prompt(prompt);
    (await firebaseutils).updateServerChannelUserHistory(message.guildId, message.channelId, message.author.id,session.history).then((value)=>{console.log("Update Done.")});
    return response;
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (
            message.mentions.users.has(message.client.user.id)
            // message.mentions.roles.has(message.client.user.roles)
            && message.cleanContent.startsWith(`@${message.client.user.username}`)
        ) {
            let prompt = message.cleanContent.replace(`@${message.client.user.username} `, "")
            
            // The chunk below is to activate the typing status while Shashi gets
            // the message history, generates a response and updates the firestore.
            message.channel.sendTyping();
            const intervalId = setInterval(async () => { message.channel.sendTyping(); }, 10000);
            try {
                while (true) {
                    const response = await queryLLMAndGetResponse({ message, prompt })
                    if (response) {
                        clearInterval(intervalId);
                        break;
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                console.error("Error:", error);
            }
            
            await message.reply(response);
        }
    },
};