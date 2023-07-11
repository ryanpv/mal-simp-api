const { db } = require('../../firebase-config.js');
const { validationResult } = require('express-validator');

const createSaveCategory = async (req, res) => {
  try {
    const result = validationResult(req)
    if (result.isEmpty()) { 
      const collectionName = process.env.NODE_ENV === 'dev' ? 'test-anime-categories' : 'anime-categories'
      const docRef = db.collection(collectionName).doc();
      await docRef.set({
        userId: req.session.uid,
        categoryName: req.body.categoryName
      });
  
      res.send('Category creation successful');

    } else {
      res.status(400).send('Invalid request');
      }

  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  createSaveCategory
}