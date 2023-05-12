const { db } = require('../../firebase-config.js');

const fetchUserCategories = async (req, res) => {
  try {
    const userCategories = await db.collection('anime-categories')
      .where('userId', '==', req.session.uid)
      .orderBy('categoryName')
      .get();

    const categoryList = await userCategories.docs.map((category) => category.data().categoryName);

    res.send(categoryList);
  } catch (err) {
    res.send(err)
  }
};

module.exports = {
  fetchUserCategories
}