const express = require('express');
const router = express.Router();

/**
 * Returns 200. Used as a health check.
 */
router.get('/', async function (req, res) {
  res.send(200)
})

module.exports = router;