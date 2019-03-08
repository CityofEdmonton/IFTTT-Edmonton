const express = require('express');
const router = express.Router();
const handleAQHI = require('./aqhi-base')

/**
 * Handles current air quality index changes for Edmonton (#67).
 * No trigger fields are needed here.
 */
router.post('/', async function (req, res) {
  await handleAQHI(req, res, 'aqhi_current', '67', req.headers['limit'])
})

module.exports = router;