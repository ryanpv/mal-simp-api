const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

const categoryNextPage = async (req, res) => {
  try {
    const categorySnapshot = await db.collection('mal-simp')
      .where('userId', '==', req.user.uid)
      .where('categoryName', '==', req.params.categoryName)
      .orderBy('animeTitle')
      .startAfter(req.params.lastItem)
      .limit(10)
      .get();

    const snapReturn = categorySnapshot.docs.map((doc) => doc.data());

    res.send(snapReturn);
  } catch (err) {
    res.send(err)
  }
};

module.exports = {
  categoryNextPage
}