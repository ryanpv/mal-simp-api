const { db } = require('../../firebase-config.js');

const createSaveCategory = async (req, res) => {
  try {
    const docRef = db.collection('anime-categories').doc();
    await docRef.set({
      userId: req.user.uid,
      categoryName: req.body.categoryName
    });

    res.send('category creation successful');
  } catch (err) {
    res.send(err)
  }
};

module.exports = {
  createSaveCategory
}