const express = require('express');
const router = express.Router();
const handleAQHI = require('aqhi-base.js')

fieldToIFTTT = {
  'HealthRisk': 'health_risk',
  'AQHI': 'aqhi_current'
}

// Home page route.
router.post('/:field', async function (req, res) {
  req.params.field = fieldToIFTTT[req.params.field]
  let communityID = req.body.triggerFields.city
})

module.exports = router;