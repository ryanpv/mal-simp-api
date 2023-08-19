const axios = require('axios');

const querySeasonalAnime = async (req, res) => {
  try { 
    // have query require both year and season filters and must be of type Number
    if (!req.params.year || !req.params.season || parseInt(req.params.year) === typeof NaN) throw new Error('Missing seasonal query parameters');

    const seasonalQuery = await 
      axios.get(`https://api.myanimelist.net/v2/anime/season/${ req.params.year }/${ req.params.season }?limit=15&offset=${ req.params.offset }&fields=num_episodes,mean,synopsis,status`, {
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