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

module.exports = router;
