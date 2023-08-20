const axios = require('axios');

const animeRankingQuery = async (req, res) => {
  // only returning 5 results for 'Top airing' page (used for homepage), all other pages return 8 results
  console.log('offset', req.params.offset);
  try {
    const getAnimeRanking = await 
      axios.get(`https://api.myanimelist.net/v2/anime/ranking?ranking_type=${ req.params.rankType }&limit=15&offset=${ req.params.offset }&fields=pictures,status,mean,synopsis,num_episodes`, {
        headers: {
          'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID
        }
      });

    res.send(getAnimeRanking.data);
  } catch (err) {
    res.status(400).send(err)
  }
};
// const rankQuery = {
//   animeRankingQuery: animeRankingQuery
// }

module.exports = { 
  animeRankingQuery
}