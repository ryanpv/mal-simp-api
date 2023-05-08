const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccount')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

module.exports = {
  admin,
  db
};