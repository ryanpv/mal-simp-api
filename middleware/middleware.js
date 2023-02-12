const express = require('express')
const crypto = require('crypto');
const admin = require('../firebase-config')
const { getAuth } = require('firebase-admin/auth')


function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}
const generateCodeVerifier = () => {
  var array = new Uint32Array(128);
  // var array = new Uint32Array(56 / 2);
  const rando = crypto.webcrypto.getRandomValues(array);
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
  // console.log('passed', a);

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
  const verifier = await generateCodeVerifier();
  const challenger = await generateCodeChallengeFromVerifier(verifier)
  const pkceAuth = {
    verifier: verifier,
    challenger: challenger,
  }

  res.cookie('pkce_cookie', pkceAuth, {
    httpOnly: true,
    // secure: true
  })

  return next();
}

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]

  try {
    const decodeFirebaseToken = await getAuth().verifyIdToken(token).then((decodedToken) => req.user = decodedToken)

  } catch (err) {
    console.log(err);
  }
  return next()

}

// const getMalToken = async (req, res, next) => {
//   const malCookie = req.cookies.mal_access_token
//   try {
//     req.mal_Cookie = malCookie

//     console.log('sending middleware cookie');


//     next()
//   } catch (err) {
//     console.log('malCookie unavail');
//   }

// }


module.exports = {
  getCode,
  verifyFirebaseToken
}