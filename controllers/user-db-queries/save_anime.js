const { db } = require('../../firebase-config.js');
const { validationResult } = require('express-validator');

const saveAnimeToCategory = async (req, res) => {
  try {
    const result = validationResult(req)

    if (result.isEmpty()) {
      console.log('passed validation');
      const collectionName = process.env.NODE_ENV === 'dev' ? 'test-mal-simp' : 'mal-simp'
      const animeDoc = db.collection(collectionName).doc() 
      await animeDoc.set({
        userId: req.session.uid,
        animeTitle: req.body.animeTitle,
        categoryName: req.body.categoryName, // req.body sends these details ofc
        animeId: req.body.animeId,
        num_episodes: req.body.num_episodes,
        main_picture: req.body.main_picture,
        mean: req.body.mean
      }, { merge: true });
      res.status(200).send('Successfully saved entry to category')
    } else {
      console.log('failed validation');
      throw new Error('Input validation FAILED')
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  saveAnimeToCategory
}
// const titlesDoc = db.collection('saved-anime-titles').doc(req.user.uid)
// const getDoc = await titlesDoc.get()

// titlesDoc.get()
//   .then((docSnapshot) => {
//     if (docSnapshot.exists) {
//       console.log(getDoc.data());
//       titlesDoc.update({
//         animeTitleList: FieldValue.arrayUnion({animeTitle: req.body.animeTitle, animeId: req.body.animeId})
//       })
//     } else {
//       titlesDoc.set({
//         userId: req.user.uid,
//         animeTitleList: [{animeTitle: req.body.animeTitle, animeId: req.body.animeId}]
//       })
//     }
//   })