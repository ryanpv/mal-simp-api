const { get } = require('axios');

const querySeasonalAnime = async (req, res) => {
  // have query require both year and season filters
  if (!req.params.year || !req.params.season) throw new Error('Missing seasonal query parameters');

  try { 
    const seasonalQuery = await 
      get(`https://api.myanimelist.net/v2/anime/season/${ req.params.year }/${ req.params.season }?limit=8&offset=${ req.params.offset }&fields=${ req.params.genre },num_episodes,mean,synopsis,status`, {
        headers: {
          'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID
        }
      })
    
      res.send(seasonalQuery.data);
  } catch (err) {
    res.send({ 'error message': err.message, 'error data': err.response });
  }
};

module.exports = {
  querySeasonalAnime
}