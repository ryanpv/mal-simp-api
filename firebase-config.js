const admin = require('firebase-admin')

const serviceAccount = require('./serviceAccount')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// const db = getFirestore()



module.exports = {
  admin,
};