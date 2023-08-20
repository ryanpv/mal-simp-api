const { getAuth } = require('firebase-admin/auth');
const { validationResult } = require('express-validator');

const sessionStart = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const userAccessToken = req.body.accessToken;
      const verifiedToken = await getAuth().verifyIdToken(userAccessToken);
      const isAdmin = verifiedToken.isAdmin;
      const isRegUser = verifiedToken.isRegUser;
    
      req.session.isAuthenticated = true;
      req.session.user = verifiedToken.email;
      // req.session.displayName = verifiedToken.displayName;
      req.session.uid = verifiedToken.uid;
      // req.session.accessToken = verifiedToken.accessToken;

      // Set cookie to identify user role right on login
      if (isAdmin) {
        res.cookie('userRole', 'admin', { httpOnly: false });
      } else if (isRegUser) {
        res.cookie('userRole', 'regUser', { httpOnly: false });
      } else {
        res.cookie('userRole', 'null', { httpOnly: false });
      }
  
      res.status(200).send('Session start success!');
    } else {
      throw new Error('Input validation FAILED')
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = sessionStart