const express = require('express');
const app = express();
const router = require('./notifierRouter');

app.use(router);

app.listen(5001, () => {
  console.log('Notifier service running on http://localhost:5001');
});