const { Events, CompressionMethod } = require('discord.js');
const infer = import('../infer.mjs');

async function queryLLMAndGetResponse({ message, prompt }) {
    // console.log(message)
    let session = new (await infer).LlamaChatSessionWithHistory({ username: message.author.username })
    response = await session.prompt(prompt);
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
            let prompt = message.cleanContent.replace(`@${message.client.user.username}`, "Shashi")
            message.channel.sendTyping();
            const intervalId = setInterval(async () => { message.channel.sendTyping(); }, 10000);
            try {
                while (true) {
                    const response = await queryLLMAndGetResponse({ message, prompt })
                    console.log(response);
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