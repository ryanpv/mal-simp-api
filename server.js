const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const functions = require('firebase-functions')
const port = 6969
const router = express.Router();


app.use(cors({ 
  origin: true,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));

app.use(express.json());
app.use(cookieParser());
app.use(require("./routes/routing.js"));



app.listen(port, () => {
  console.log(`server connected to port ${port}`);
});

exports.api = functions.https.onRequest(app)

// https://myanimelist.net/apiconfig/references/api/v2#operation/anime_get