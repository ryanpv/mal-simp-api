const express = require("express");
const cors = require("cors")
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('./firebase-config.js')
const { db } = require('./firebase-config.js')

const { FirestoreStore } = require('@google-cloud/connect-firestore')
const functions = require('firebase-functions');
const port = 6969;

// process.env.NODE_ENV = 'development' // change or comment out for PROD
// process.env.NODE_ENV = 'dev'


app.use(cors({ 
  // origin: true,
  origin: [
    'http://localhost:3000',
    'http://localhost:6969',
    'https://mal-simplified.web.app',
    'https://us-central1-mal-simplified.cloudfunctions.net/api',
    'https://myanimelist.net',
    'https://api.myanimelist.net'
  ],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  store: new FirestoreStore({
    dataset: db,
    kind: 'express-sessions' 
  }),
}));

app.use(require("./routes/routing.js"));


if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
    app.listen(port, () => {
      console.log(`server connected to port ${port}`);
    });

    module.exports = app;
} else {
  console.log('in prod');
  exports.api = functions.https.onRequest(app)
}


// https://myanimelist.net/apiconfig/references/api/v2#operation/anime_get