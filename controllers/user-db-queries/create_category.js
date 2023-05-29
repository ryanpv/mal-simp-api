const { db } = require('../../firebase-config.js');

const createSaveCategory = async (req, res) => {
  try {
    const collectionName = process.env.NODE_ENV === 'dev' ? 'test-anime-categories' : 'anime-categories'
    const docRef = db.collection(collectionName).doc();
    await docRef.set({
      userId: req.session.uid,
      categoryName: req.body.categoryName
    });

    res.send('Category creation successful');
  } catch (err) {
    console.log('creation err: ', err);
    res.status(500).send(err);
  }
};

module.exports = {
  createSaveCategory
}