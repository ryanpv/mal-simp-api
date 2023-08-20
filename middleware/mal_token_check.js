const checkMalToken = (req, res, next) => {
  const malToken = req.cookies.mal_access_token;
  
  if (!malToken || malToken === undefined) {
    res.status(401).send('No MAL token available. Login credentials required.')
  } else {
    next();
  }
};

module.exports = {
  checkMalToken
}