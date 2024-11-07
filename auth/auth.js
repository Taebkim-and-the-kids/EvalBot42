const axios = require('axios');
const { ecole_clientId, ecole_client_secret } = require('../config.json');

async function getAccessToken() {
    try {
        const response = await axios.post('https://api.intra.42.fr/oauth/token', {
            grant_type: 'client_credentials',
            client_id: ecole_clientId,
            client_secret: ecole_client_secret,
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}

module.exports = { getAccessToken };