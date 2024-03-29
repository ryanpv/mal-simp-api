const { db } = require('../../firebase-config.js');
const { validationResult } = require('express-validator');

const getCategoryData = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const collectionName = process.env.NODE_ENV === 'dev' ? 'test-mal-simp' : 'mal-simp'

      const categorySnapshot = await db.collection(collectionName)
        .where('userId', '==', req.session.uid)
        .where('categoryName', '==', req.params.categoryName)
        .orderBy('animeTitle')
        // .startAfter('title')
        .select('animeTitle', 'categoryName', 'animeId', 'num_episodes', 'main_picture', 'mean') // omits userId which is saved in each doc
        .limit(10)
        .get();
  
      // const lastQueryItem = categorySnapshot.docs[categorySnapshot.docs.length -1] // last doc from previous query
      const snapReturn = categorySnapshot.docs.map((doc) => doc.data());
          // .then((snaps) => {return snaps.data()}); // get() method will return entire collection
      // const snapReturn = snapshot.get()
      //   .then((snap) => {
        //     return snap.docs.map(doc => doc.data());
        //   }).catch(err => console.log(err))
      // console.log(`no cache hit for ${ req.originalUrl }`);
      // console.log(`snap return ${ JSON.stringify(snapReturn) }`);
      // console.log('snap: ', snapReturn);
      if (snapReturn.length < 1) {
        res.status(200).send('No data available.');
      } else {
        res.send(snapReturn);
      }
    } else {
      throw new Error("Request validation FAILED")
    }
  } catch (err) {
    // console.log('category data err: ', err);
    res.status(500).send(err)
  }
};

module.exports = {
  getCategoryData
}