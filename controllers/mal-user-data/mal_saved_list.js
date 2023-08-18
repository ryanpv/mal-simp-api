const axios = require('axios');

const getMalSavedList = async (req, res) => {
  try {
    const malToken = req.cookies.mal_access_token
    if (!malToken) {
      res.status(401).send('No MAL token')
    } else {
      const getUserAnimeList = await 
        axios.get(`https://api.myanimelist.net/v2/users/@me/animelist?fields=mean,synopsis,status,videos,num_episodes&offset=${ req.params.offset }&limit=10`, 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':`Bearer ${ malToken && malToken.access_token }` 
          }
        });

      res.send(getUserAnimeList.data);
    }
  } catch (err) {
    res.send({ 'error message': err.message, 'error data': err.response })
  }
};

module.exports = {
  getMalSavedList
}