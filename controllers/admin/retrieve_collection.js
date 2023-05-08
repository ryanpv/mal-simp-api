const { db } = require('../../firebase-config.js');

const getDbCollection = async (req, res) => {
  try {
    console.time('Execution Time');
    const collection = await db.collection('mal-simp').get()
    const resArr = []
    // forEach method will automatically be called on the '.docs' property of the QuerySnapshot***
    await collection.forEach((doc) => {
      const data = doc.data();
      data.mrn = doc.id
      resArr.push(data)
      // return {id: doc.id, data: doc.data()}
    })
    collection.docs.map(doc => doc.data()); //data() will return data (snapshot object) as a json object (extracts the data from a DocumentSnapshot)***
    // console.log(resArr);
    console.timeEnd('Execution Time');
    res.send(collection);
  } catch (err) {
    res.send(err)
  }
};

module.exports = {
  getDbCollection
}