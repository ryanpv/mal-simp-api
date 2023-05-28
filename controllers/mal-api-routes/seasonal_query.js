const axios = require('axios');

const querySeasonalAnime = async (req, res) => {
  try { 
    // have query require both year and season filters
    if (!req.params.year || !req.params.season) throw new Error('Missing seasonal query parameters');

    const seasonalQuery = await 
      axios.get(`https://api.myanimelist.net/v2/anime/season/${ req.params.year }/${ req.params.season }?limit=8&offset=${ req.params.offset }&fields=num_episodes,mean,synopsis,status`, {
        headers: {
          'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID
        }
      })

      res.send(seasonalQuery.data);
  } catch (err) {
    // return err.message
    res.status(400).send(err.message)
  }
};

module.exports = {
  querySeasonalAnime
}