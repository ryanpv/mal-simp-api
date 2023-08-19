const axios = require('axios');

const userRecommendations = async (req, res) => {
  try {
    const malToken = req.cookies.mal_access_token;
    if (!malToken) {
      res.status(401).send('No MAL token')
    } else {
      const getUserRecommendations = await
        axios.get(`https://api.myanimelist.net/v2/anime/suggestions?limit=15&offset=${ req.params.offset }&fields=synopsis,mean,status,num_episodes`, 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization':`Bearer ${ malToken && malToken.access_token }`
          }
        });

      res.send(getUserRecommendations.data)
    }
  } catch (err) {
    res.status(400).send({ 'error message': err.message, 'error data': err.response })
  }
};

module.exports = {
  userRecommendations
}