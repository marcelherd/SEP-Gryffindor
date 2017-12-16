/**
 * This module defines the endpoints
 * of the health HTTP interface.
 *
 * @author Marcel Herd
 * @module routes/health
 */

const express = require('express');

const router = express.Router();

const healthController = require('../controllers/HealthController');

router.route('/')
  .get(healthController.checkHealth);

module.exports = router;
