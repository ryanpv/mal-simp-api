const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccount')
console.log('firebase env config: ', process.env.FIRESTORE_EMULATOR_HOST);
console.log('firebase projectid: ', serviceAccount.project_id);

admin.initializeApp({
  projectId: serviceAccount.project_id,
  credential: admin.credential.cert(serviceAccount),
  databaseUrl: 'https://mal-simplified.firebaseio.com'
});

const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

module.exports = {
  admin,
  db
};