const express = require('express');
const app = express();
const router = require('./unqfyRouter');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);

app.listen(5000, () => {
  console.log('UNQfy server running on http://localhost:5000');
});