const { getAuth } = require('firebase-admin/auth');

const setUserClaims = async (req, res, next) => {

  try {
    const userAccessToken = req.body.accessToken;
    const verifiedToken = await getAuth().verifyIdToken(userAccessToken);
    const user = verifiedToken
  
    if (!verifiedToken.isRegUser) {
      await getAuth()
        .setCustomUserClaims(user.uid, { isRegUser: true });

      next();
    } else {
      next();
    }

  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = setUserClaims