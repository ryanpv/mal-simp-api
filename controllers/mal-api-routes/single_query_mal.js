const axios = require('axios');

const singleAnimeQuery = async (req, res) => {
  try {
    const animeQuery = await axios.get(`https://api.myanimelist.net/v2/anime/${ req.params.id }?fields=${ req.params.fields }`, {
      headers: {
        'X-MAL-CLIENT-ID': process.env.MAL_CLIENT_ID
      }
    });

    res.send(animeQuery.data)
  } catch (err) {
    // console.log('real err', err);
    res.status(400).send(err)
    }
};

module.exports = {
  singleAnimeQuery
}

  // anime/30230?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,
  // rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,
  // my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics
  // videos*********** field will provide the trailer URLs
  // some fields cannot be retrieved together