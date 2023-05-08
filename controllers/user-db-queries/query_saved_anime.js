const { db } = require('../../firebase-config.js');

// *** text search with firebase db not recommended - firebase suggests using third party search ***

const savedAnime = async (req, res) => {
  try {
    const animeSearch = await db.collection('mal-simp')
      .where('userId', '==', req.user.uid)
      .where('animeTitle', '>=', req.params.animeSearch)
      .where('animeTitle', '<=', '\uf8ff')
      .get()
      .then(query => query.forEach(doc => console.log(doc.data()))) 

      // const searchResult = animeSearch.docs.map((doc) => doc.data())
      res.send(animeSearch);

  } catch (err) {
    console.log('error with search query: ', err);
  }
}

module.exports = {
  savedAnime
}