const { getFirestore } = require('firebase-admin/firestore')
const db = getFirestore();

const saveAnimeToCategory = async (req, res) => {
  try {
    const animeDoc = db.collection('mal-simp').doc() 
    await animeDoc.set({
      userId: req.user.uid,
      animeTitle: req.body.animeTitle,
      categoryName: req.body.categoryName, // req.body sends these details ofc
      animeId: req.body.animeId,
      num_episodes: req.body.num_episodes,
      main_picture: req.body.main_picture,
      mean: req.body.mean
    }, { merge: true });

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

    res.send('saved entry to category')
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  saveAnimeToCategory
}