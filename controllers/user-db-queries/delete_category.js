const { db } = require('../../firebase-config.js');

const deleteCategory = async (req, res) => {
  try {
    const deleteCategory = await db.collection('anime-categories') // deletes the category
      .where('userId', '==', req.user.uid)
      .where('categoryName', '==', req.params.categoryName);

    deleteCategory.get().then((query) => {
      query.forEach(doc => doc.ref.delete())
    });

    const deleteCategoryContents = await db.collection('mal-simp') // deletes all anime saved to category
      .where('userId', '==', req.user.uid)
      .where('categoryName', '==', req.params.categoryName);

    deleteCategoryContents.get().then((query) => {
     query.forEach(doc => doc.ref.delete())
     console.log('content deleted');
  });

    console.log('delete succsesfully');
    res.end();
  } catch (err) {
    res.send(err);
  }
};

module.exports = {
  deleteCategory
}