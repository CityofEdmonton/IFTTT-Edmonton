const express = require('express');
const router = express.Router();
const handleAQHI = require('./aqhi-base')

// Home page route.
router.post('/', async function (req, res) {
  await handleAQHI(req, res, 'health_risk', '67')
})

module.exports = router;