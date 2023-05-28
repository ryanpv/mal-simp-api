const crypto = require('crypto');

function dec2hex(dec) {
  return ("0" + dec.toString(16)).substring(-2);
}

function generateCodeVerifier() {
  var array = new Uint32Array(128);
  // var array = new Uint32Array(56 / 2);
  crypto.webcrypto.getRandomValues(array);
  // window.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
}


////// code challenge

function sha256(plain) {
  // returns promise ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = crypto.createHash('sha256').update(data).digest('base64')
  return hash
  // return window.crypto.subtle.digest("SHA-256", data);
}

function base64urlencode(a) {
  const buffer = Buffer.from(`${a}`).toString('base64')
  // var str = "";
  // var bytes = new Uint8Array(a);
  // var len = bytes.byteLength;
  // for (var i = 0; i < len; i++) {
  //   str += String.fromCharCode(bytes[i]);
  //   console.log(str);
  // }
  return buffer
  // return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generateCodeChallengeFromVerifier(v) {
  var hashed = await sha256(v);
  var base64encoded = base64urlencode(hashed);

  return base64encoded;
}

const getCode = async (req, res, next) => {
  const verifier = await service.generateCodeVerifier();
  // const challenger = ""
  const challenger = await service.generateCodeChallengeFromVerifier(verifier)
  const pkceAuth = {
    verifier: verifier,
    challenger: challenger,
  }

  res.cookie('pkce_cookie', pkceAuth, {
    httpOnly: true,
    // secure: true
  })

  if (verifier === "" || challenger === "") {
    res.status(500).send("CODE CHALLENGE ERROR")
    // return next()
  } else {
    return next();
  }
};

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const isAuthenticated = req.session.isAuthenticated;
    const userRole = req.cookies.userRole;

    if (isAuthenticated && userRole === 'admin' || isAuthenticated && userRole === 'regUser') {
      // user is fully authenticated
      next();
    } else {
      req.session.destroy();
      res.cookie('userRole', 'null', { httpOnly: false });
      res.status(401).send('Firebase token unavailable/invalid')
    }
  } catch (err) {
    res.status(401).send(err)
  }
};

const service = {
  dec2hex: dec2hex,
  getCode: getCode,
  verifyFirebaseToken: verifyFirebaseToken,
  generateCodeVerifier: generateCodeVerifier,
  generateCodeChallengeFromVerifier: generateCodeChallengeFromVerifier,
}

module.exports = service