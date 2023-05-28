const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccount')
console.log('env config: ', process.env.NODE_ENV);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseUrl: process.env.NODE_ENV === 'test' ? 'https://test-mal-simplified.firebaseio.com' : 'https://mal-simplified.firebaseio.com'
});

const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

module.exports = {
  admin,
  db
};