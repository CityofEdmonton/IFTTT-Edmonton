var express = require('express');
var router = express.Router();

// Home page route.
router.get('/', async function (req, res) {
  res.send('Wiki home page');
})

// About page route.
router.get('/about', async function (req, res) {
  res.send('About this wiki');
})

module.exports = router;