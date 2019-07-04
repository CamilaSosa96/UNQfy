const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/api/notify', (req, res) => {
    console.log(req.body);
    res.status(200).send({});
});

module.exports = router;