const malCodeChallenge = async (req, res) => {
  if(process.env.NODE_ENV === 'development') {
// MUST BE REDIRECTED OTHERWISE MAL API CANNOT VERIFY CODE_CHALLENGE FOR WHATEVER REASON*****************
    await res.redirect('/callback');
  } else {
    await res.redirect('/api/callback');
  }
};

module.exports = {
  malCodeChallenge,
}