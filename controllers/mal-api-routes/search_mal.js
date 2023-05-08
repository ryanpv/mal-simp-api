const { get } = require('axios');

const searchMalAnime = async (req, res) => {
  try {
    const animeSearchResults = await 
      get(`https://api.myanimelist.net/v2/anime?q=${ req.query.q }&offset=${ req.params.offset }&limit=15&fields=pictures,mean,synopsis`, {
        headers: {
          'X-MAL-CLIENT-ID' : process.env.MAL_CLIENT_ID
        }
      })

    res.send(animeSearchResults.data);
  } catch (err) {
    console.log(err);
    res.send('mal db search error')
  }
};

module.exports = {
  searchMalAnime
}