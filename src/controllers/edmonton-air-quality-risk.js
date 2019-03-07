const express = require('express');
const router = express.Router();
const handleAQHI = require('./aqhi-base')

/**
 * Handles health risk changes for Edmonton (#67).
 * This route requires no triggerFields.
 */
router.post('/', async function (req, res) {
  await handleAQHI(req, res, 'health_risk', '67')
})

module.exports = router;