const express = require('express');
const app = express();
const router = require('./unqfyRouter');

app.use(router);

app.listen(5000, () => {
  console.log('UNQfy server running on http://localhost:5000');
});