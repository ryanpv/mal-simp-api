const { get } = require('axios');

const getMalUsername = async (req, res) => {
  const malTokenData = req.cookies.mal_access_token;

  try {
    const malUserDetails = await get('https://api.myanimelist.net/v2/users/@me?fields=anime_statistics',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization':`Bearer ${ malTokenData && malTokenData.access_token }`,
      }
    });

    res.send(malUserDetails.data);
  } catch (err) {
    console.log({ 'error message': err.message, 'error data': err.response });
    res.send('MAL access token unavailable. Login required');
  }
};

module.exports = {
  getMalUsername
}