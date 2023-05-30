const { db } = require('../../firebase-config.js');

const fetchUserCategories = async (req, res) => {
  try {
    const categoryCollection = process.env.NODE_ENV === 'dev' ? 'test-anime-categories' : 'anime-categories'
    const userCategories = await db.collection(categoryCollection)
      .where('userId', '==', req.session.uid)
      .orderBy('categoryName')
      .get();

    const categoryList = await userCategories.docs.map((category) => category.data().categoryName);

    res.send(categoryList);
  } catch (err) {
    res.status(500).send(err)
  }
};

module.exports = {
  fetchUserCategories
}