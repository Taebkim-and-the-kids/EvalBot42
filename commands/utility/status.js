const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { getAccessToken } = require('../../auth/auth');

async function getUserInfo(username, accessToken) {
    try {
        const response = await axios.get(`https://api.intra.42.fr/v2/users/${username}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;  // 응답 데이터만 반환
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('본인의 정보를 확인할 수 있습니다')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('확인할 유저의 이름')
                .setRequired(true)
        ),
    async execute(interaction) {
        const username = interaction.options.getString('username');

        try {
            await interaction.deferReply();  // 응답 시간을 확보하기 위해 지연 응답 설정
            const accessToken = await getAccessToken();
            const userInfo = await getUserInfo(username, accessToken);

            // userInfo의 데이터 추출
            await interaction.editReply(`Hello, (${userInfo.first_name} ${userInfo.last_name}) ${userInfo.login}`);
        } catch (error) {
            console.error('An error occurred:', error);
            await interaction.editReply('유저 정보를 조회하는 데 실패했습니다.');
        }
    },
};
