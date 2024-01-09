const { SlashCommandBuilder } = require('discord.js');
const infer = import('../../infer.mjs');
const firebaseutils = import("../../firebase.mjs");
// const LlamaChatSessionWithHistory = import('../../infer.mjs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('clears your chat history with SHASHI')
        // .addStringOption(option => option.setName('prompt').setDescription('What do you want to ask Shashi?').setRequired(true))
        ,
	async execute(interaction) {
        await interaction.deferReply({ephemeral: true});
        let response = await (await firebaseutils).deleteServerChannelUserHistory(interaction.guildId,interaction.channelId,interaction.user.id);
        if (response==0){
            await interaction.editReply({content: "Successfully cleared your history in this Channel.",ephemeral:true});
        }
	},
};