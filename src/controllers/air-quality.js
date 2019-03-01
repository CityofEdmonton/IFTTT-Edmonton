const express = require('express');
const router = express.Router();
const parseXML = require('../utils/parseXML')

// Home page route.
router.get('/:field', async function (req, res) {
  console.log(`Watching field: ${req.query.field}`)
  req.cache.set(req.query.field, 'a value')
  res.send('Wiki home page');
})

// About page route.
router.get('/about', async function (req, res) {
  console.log(req.cache.get('a key'))
  res.send('About this wiki');
})

module.exports = router;