const { db } = require('../../firebase-config.js');
const { validationResult } = require('express-validator');

const categoryNextPage = async (req, res) => {
  try {
    const result = validationResult(req)

    if (result.isEmpty()) {
      const collectionName = process.env.NODE_ENV === 'dev' ? 'test-mal-simp' : 'mal-simp'
      const categorySnapshot = await db.collection(collectionName)
        .where('userId', '==', req.session.uid)
        .where('categoryName', '==', req.params.categoryName)
        .orderBy('animeTitle')
        .startAfter(req.params.lastItem)
        .select('animeTitle', 'categoryName', 'animeId', 'num_episodes', 'main_picture', 'mean')
        .limit(10)
        .get();
  
      const snapReturn = categorySnapshot.docs.map((doc) => doc.data());
  
      if (snapReturn.length < 1) {
        res.status(400).send('No data available.');
      } else {
        res.send(snapReturn);
      }
    } else {
      throw new Error("Request validation FAILED")
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  categoryNextPage
}