const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const port = process.env.PORT;


app.use(cors({ 
  origin: [
    'http://localhost:3000',
    'http://localhost:6969'
  ],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));

app.use(express.json());
app.use(cookieParser());
app.use(require("./routes/routing.js"));

app.listen(port, () => {
  console.log(`server connected to port ${port}`);
});


// https://myanimelist.net/apiconfig/references/api/v2#operation/anime_get