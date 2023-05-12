const { get } = require('axios');

const animeRankingQuery = async (req, res) => {
  // only returning 5 results for 'Top airing' page (used for homepage), all other pages return 8 results
  const limit = req.params.rankType === 'airing' ? 5 : 8; 
  try {
    const getAnimeRanking = await 
      get(`https://api.myanimelist.net/v2/anime/ranking?ranking_type=${ req.params.rankType }&limit=${ limit }&offset=${ req.params.offset }&fields=pictures,status,mean,synopsis,num_episodes`, {
        headers: {
          'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID
        }
      })
    res.send(getAnimeRanking.data);
  } catch (err) {
    // res.send({ 'error message': err.message, 'error data': err.response })
    res.send(err)
  }
};

module.exports = {
  animeRankingQuery
}