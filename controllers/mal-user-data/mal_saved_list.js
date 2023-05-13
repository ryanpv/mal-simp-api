const { get } = require('axios');

const getMalSavedList = async (req, res) => {
  const malToken = req.cookies.mal_access_token
  try {
    if (!malToken) {
      console.log('no mal token');
      res.send('No MAL token')
    } else {

      const getUserAnimeList = await 
      get(`https://api.myanimelist.net/v2/users/@me/animelist?fields=mean,synopsis,status,videos,num_episodes&offset=${ req.params.offset }&limit=8`, 
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