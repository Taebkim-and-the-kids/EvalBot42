const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { getAccessToken } = require('../../auth/auth');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('특정 유저의 예약 가능한 슬롯 정보를 확인합니다')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('확인할 유저의 이름')
                .setRequired(true)
        ),
    async execute(interaction) {
        const username = interaction.options.getString('username');
        const accessToken = await getAccessToken();

        if (!accessToken) {
            await interaction.reply('Access token is not available. Please authenticate first.');
            return;
        }

        try {
            const response = await axios.get(`https://api.intra.42.fr/v2/users/${username}/slots`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const slots = response.data;
            if (slots.length === 0) {
                await interaction.reply(`No available slots for ${username}.`);
            } else {
                let slotInfo = `Available slots for ${username}:\n`;
                slots.forEach(slot => {
                    slotInfo += `Start: ${slot.start}, End: ${slot.end}, Status: ${slot.status}\n`;
                });
                await interaction.reply(slotInfo);
            }
        } catch (error) {
            console.error('Error fetching slots:', error.response ? error.response.data : error.message);
            await interaction.reply('정보 조회 실패');
        }
    },
};