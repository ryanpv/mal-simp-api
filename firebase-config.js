const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccount')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseUrl: 'https://mal-simplified.firebaseio.com'
});

const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

module.exports = {
  admin,
  db
};