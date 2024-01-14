const { Events, CompressionMethod } = require('discord.js');
const infer_llamacpp = import('../infer_llamacpp.mjs');
const firebaseutils = import("../firebase.mjs");

async function queryLLMAndGetResponse({ message, prompt }) {
    // console.log(message)
    let oldhistory = await (await firebaseutils).getServerChannelUserHistory(message.guildId, message.channelId, message.author.id)
    let session = new (await infer_llamacpp).LlamaChatSessionWithHistory({ username: message.author.username, history:oldhistory})
    response = await session.prompt(prompt);
    (await firebaseutils).updateServerChannelUserHistory(message.guildId, message.channelId, message.author.id,session.history).then((value)=>{console.log("Update Done.")});
    return response;
}

async function replyWithLongMessage({message,response}){
    response_sentences = response.match( /[^\.!\?]+[\.!\?]?/g );
    // await message.reply("Okay!")
    resultString = ''
    current_sentence_index = 0
    while (current_sentence_index < response_sentences.length) {
        const currentString = response_sentences[current_sentence_index];
        if (resultString.length + currentString.length < 2000) {
            resultString += currentString;
        } else {
            await message.reply(resultString);
            resultString = currentString
        }
        current_sentence_index++;
    }
    await message.reply(resultString);
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (
            message.mentions.users.has(message.client.user.id)
            // message.mentions.roles.has(message.client.user.roles)
            && (
                message.cleanContent.startsWith(`@${message.client.user.username}`)
                || message.mentions.repliedUser.id == message.client.user.id
                )
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
            await replyWithLongMessage({message,response})
        }
    },
};