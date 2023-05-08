const { get } = require('axios');

const userRecommendations = async (req, res) => {
  const malToken = req.cookies.mal_access_token;
  console.log('recommendations called');
  try {
    const getUserRecommendations = await
      get(`https://api.myanimelist.net/v2/anime/suggestions?limit=8&offset=${ req.params.offset }&fields=synopsis,mean,status,num_episodes`, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization':`Bearer ${ malToken && malToken.access_token }`
        }
      });

    res.send(getUserRecommendations.data)
  } catch (err) {
    console.log('got a user rec error');
    res.send({ 'error message': err.message, 'error data': err.response })
  }
};

module.exports = {
  userRecommendations
}