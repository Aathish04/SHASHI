const { SlashCommandBuilder } = require('discord.js');
const infer = import('../../infer.mjs');
// const LlamaChatSessionWithHistory = import('../../infer.mjs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shashi')
		.setDescription('Invokes Shashi')
        .addStringOption(option => option.setName('prompt').setDescription('What do you want to ask Shashi?').setRequired(true)),
	async execute(interaction) {
        await interaction.deferReply();
        const prompt = interaction.options.getString('prompt')
        // console.log(LlamaChatSessionWithHistory)
        let session = new (await infer).LlamaChatSessionWithHistory({username:interaction.user.username})
        response = await session.prompt(prompt);
        await interaction.editReply(response);
	},
};