const axios = require("axios");

const getMalAccessToken = async (req, res) => {
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
      redirect_uri: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/logcallback' : 'https://mal-simplified.web.app/logcallback',
      code_verifier: req.cookies.pkce_cookie.challenger
    };
    const malAuth = await axios.post('https://myanimelist.net/v1/oauth2/token', data, { headers: headers })

    res.cookie('mal_access_token', malAuth.data, {
      httpOnly: 'true'
    });

    if (req.cookies.mal_access_token) {
      req.malCookie = malAuth.access_token
    }

    res.end();
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getMalAccessToken,
}