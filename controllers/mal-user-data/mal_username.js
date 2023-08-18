const axios = require('axios');

const getMalUsername = async (req, res) => {
  try {
    console.log('mal username check');
    const malToken = req.cookies.mal_access_token;
    if (!malToken) {
      res.status(401).send('No MAL token')
    } else {
      const malUserDetails = await axios.get('https://api.myanimelist.net/v2/users/@me?fields=anime_statistics',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization':`Bearer ${ malToken && malToken.access_token }`,
        }
      });
  
      res.send(malUserDetails.data);
    }
  } catch (err) {
    res.status(400).send({ 'error message': err.message, 'error data': err.response });
  }
};

module.exports = {
  getMalUsername
}