/**
 * This module defines the endpoints
 * of the authenticate HTTP interface.
 *
 * @module routes/auth
 */

const express = require('express');

const router = express.Router();

const authController = require('../controllers/AuthController');

router.route('/')
  .post(authController.authenticate);

// TODO: remove
router.route('/setup')
  .get(authController.setup);

module.exports = router;
