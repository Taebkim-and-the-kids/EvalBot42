const axios = require('axios');
const { ecole_clientId, ecole_client_secret, auth_code, redirect_uri } = require('../config.json');

async function getAccessToken() {
    try {
        const response = await axios.post('https://api.intra.42.fr/oauth/token', {
            grant_type: 'client_credentials',
            code: auth_code,
            client_id: ecole_clientId,
            client_secret: ecole_client_secret,
            redirect_uri: redirect_uri,
            scope: 'public projects',
        });
        console.log('Access Token:', response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    }
}

module.exports = { getAccessToken };