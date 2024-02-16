const { SlashCommandBuilder } = require('discord.js');
const firebaseutils = import("../../firebase.mjs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('clears your chat history with SHASHI')
    // .addStringOption(option => option.setName('prompt').setDescription('What do you want to ask Shashi?').setRequired(true))
    ,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        console.log(`Recieved request to clear history from ${interaction.user.id}(${interaction.user.username})`)
        try {
            let response = await (await firebaseutils).deleteServerChannelUserHistory(interaction.guildId, interaction.channelId, interaction.user.id);
            if (response == 0) {
                await interaction.editReply({ content: "Successfully cleared your history in this Channel.", ephemeral: true });
            }
            console.log(`Cleared history for ${interaction.user.id}(${interaction.user.username})`)
        } catch (error) {
            console.log("ERROR: ", error)
            await interaction.editReply({ content: "Error Contacting Database.", ephemeral: true });
        }
    },
};