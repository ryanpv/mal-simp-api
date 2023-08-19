const axios = require("axios");

const getMalAccessToken = async (req, res, next) => {
  try {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    };
    const data = {
      client_id: process.env.MAL_CLIENT_ID,
      client_secret: process.env.MAL_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: process.env.NODE_ENV === 'production' ? 'https://mal-simplified.web.app/logcallback' : 'http://localhost:3000/logcallback',
      code_verifier: req.cookies.pkce_cookie.challenger
    };
    const malAuth = await axios.post('https://myanimelist.net/v1/oauth2/token', data, { headers: headers });
console.log("mal auth:", malAuth);
    res.cookie('mal_access_token', malAuth.data, {
      httpOnly: 'true',
      secure: process.env.NODE_ENV === 'production'
    });

    if (req.cookies.mal_access_token) {
      req.malCookie = malAuth.access_token
    }
    
    next()
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getMalAccessToken,
}