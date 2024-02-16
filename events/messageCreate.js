const { Events, CompressionMethod } = require('discord.js');
const firebaseutils = import("../firebase.mjs");
const OpenAI = require('openai');

require('dotenv').config()

const openai = new OpenAI({
    baseURL: process.env.LLM_API_BASEURL,
    apiKey: process.env.LLM_API_KEY
});

function generateSystemPrompt(options) {
    let curdate = new Date()
    let sysprompt = `${process.env.SYSTEM_PROMPT}\nToday's Date: ${curdate.toDateString()}.`
    return sysprompt;
}

async function queryLLMAndGetResponse({ message, prompt }) {
    var pastmessages;
    try {
        pastmessages = await (await firebaseutils).getServerChannelUserHistory(message.guildId, message.channelId, message.author.id)
    } catch (error) {
        console.log("ERROR: ", error)
        return "ERROR: Couldn't contact Database"
    }
    console.log(`Retrieved Chat Log for ${message.author}`)
    if (pastmessages.length) {
        pastmessages.push({ role: 'user', content: prompt })
    } else {
        pastmessages = [
            { role: 'system', content: generateSystemPrompt() },
            { role: 'user', content: prompt }
        ]
    }
    const responsejson = await openai.chat.completions.create({
        messages: pastmessages,
        temperature: 0.8,
        top_p: 0.95,
        top_k: 40,
        max_tokens: 425,
    });
    let response = responsejson.choices[0].message;
    pastmessages.push(response);
    try {
        await (await firebaseutils).updateServerChannelUserHistory(message.guildId, message.channelId, message.author.id, pastmessages);
        console.log(`Chat Log Updated for ${message.author}`)
    } catch (error) {
        console.log("ERROR: ", error)
    }
    return response.content;
}

async function replyWithLongMessage({ message, response }) {
    console.log(`Sending Response For: ${message}`)
    response_sentences = response.match(/[^\.!\?]+[\.!\?]?/g);
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
                // || message.mentions.repliedUser.id == message.client.user.id
            )
        ) {
            console.log(`Recieved Message From ${message.author}`)
            let response = ""
            let prompt = message.cleanContent.replace(`@${message.client.user.username} `, "")

            // The chunk below is to activate the typing status while Shashi gets
            // the message history, generates a response and updates the firestore.
            message.channel.sendTyping();
            const intervalId = setInterval(async () => { message.channel.sendTyping(); }, 10000);
            try {
                while (true) {

                    response = await queryLLMAndGetResponse({ message, prompt })
                    if (response) {
                        clearInterval(intervalId);
                        break;
                    }
                    // TODO: See if removing the following line is viable.
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                clearInterval(intervalId);
                console.error(`Error for ${message.author}`, error);
                response = `ERROR: The LLM backend seems to have failed.`
            }
            await replyWithLongMessage({ message, response })
        }
    },
};