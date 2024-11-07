const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { getAccessToken } = require('../../auth/auth');

const USERNAME = 'taebkim';  // 조회할 유저 이름을 입력하세요.

async function getUserInfo(username, accessToken) {
    try {
        const response = await axios.get(`https://api.intra.42.fr/v2/users/${username}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('본인의 정보를 확인할 수 있습니다'),
    async execute(interaction) {
        try {
            await interaction.deferReply();  // 응답 시간을 확보하기 위해 지연 응답 설정
            const accessToken = await getAccessToken();
            const userInfo = await getUserInfo(USERNAME, accessToken);
            await interaction.editReply(`Hello, ${userInfo.login}`);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    },
};