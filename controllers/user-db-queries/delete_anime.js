const { db } = require('../../firebase-config.js');

const deleteSavedAnime = async (req, res) => {
  try {
    const collectionName = process.env.NODE_ENV === 'dev' ? 'test-mal-simp' : 'mal-simp'
    const deleteQuery = await db.collection(collectionName)
      .where('userId', '==', req.session.uid)
      .where('categoryName', '==', req.body.categoryName)
      .where('animeId', '==', parseInt(req.body.animeId)) // animeId is posted as INT, ensure all reqs are parsed
      .limit(1) // limit 1 so user can only delete one doc at a time - solution for duplicate data
      .get()
  // .then((query) => {
  //   query.forEach((animeDoc) => animeDoc.ref.delete())
  // });
    await deleteQuery.docs.map(doc => doc.ref.delete());

// const deleteTitle = await db.collection('saved-anime-titles')
//   .where('userId', '==', req.user.uid)
//   .where('animeId', '==', req.body)
//   .get()

//   const result = await deleteTitle.docs.map(doc => console.log('title: ', doc.data()))
    res.status(200).send('Successfully removed anime');
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  deleteSavedAnime
}