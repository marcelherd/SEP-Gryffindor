const express = require('express');

const router = express.Router();

const healthController = require('../controllers/HealthController');

router.route('/')
  .get(healthController.checkHealth);

module.exports = router;
