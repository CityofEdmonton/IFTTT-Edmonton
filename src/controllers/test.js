const express = require('express');
const router = express.Router();

/**
 * Gives IFTTT a set of test data to run on our endpoints. 
 * See here for info: https://platform.ifttt.com/docs/testing
 * When adding new controllers or editing old controllers,
 * please add up to date test information here.
 * Note that only controllers that have trigger fields
 * use this controller.
 */
router.post('/', async function (req, res) {
  res.send({
    data: {

    }
  })
})

module.exports = router;