const { db } = require('../../firebase-config.js');

const deleteCategory = async (req, res) => {
  try {
    const categoryCollection = process.env.NODE_ENV === 'dev' ? 'test-anime-categories' : 'anime-categories'
    const animeCollection = process.env.NODE_ENV === 'dev' ? 'test-mal-simp' : 'mal-simp'
    const deleteCategory = await db.collection(categoryCollection) // deletes the category
      .where('userId', '==', req.session.uid)
      .where('categoryName', '==', req.params.categoryName);

    deleteCategory.get().then((query) => {
      query.forEach(doc => doc.ref.delete())
    });

    const deleteCategoryContents = await db.collection(animeCollection) // deletes all anime saved to category
      .where('userId', '==', req.session.uid)
      .where('categoryName', '==', req.params.categoryName);

    deleteCategoryContents.get().then((query) => {
     query.forEach(doc => doc.ref.delete())
  });

    res.status(200).send("Category and its content successfully deleted");
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  deleteCategory
}