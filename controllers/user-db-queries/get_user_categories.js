const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

const fetchUserCategories = async (req, res) => {
  try {
    const userCategories = await db.collection('anime-categories')
      .where('userId', '==', req.user.uid)
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