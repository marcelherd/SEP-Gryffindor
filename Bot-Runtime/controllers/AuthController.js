/**
 * This module contains authentication middleware.
 *
 * @module controllers/AuthController
 */

const jwt = require('jsonwebtoken');

const config = require('../config');
const User = require('../models/User');

/**
 * Checks whether the request is authorized.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 * @param {Callback} next - The next middleware, if authorized successfully
 */
exports.isAuthenticated = function (req, res, next) {
  // TODO: authentication
  return next();
};

/**
 * Authenticates a user and sends a Token if succesful.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.authenticate = function (req, res) {
  User.findOne({
    name: req.body.name,
  }, (err, user) => {
    if (err) throw err;

    // Authentication successful
    if (user && user.password === req.body.password) {
      // Create and send token
      const payload = {
        admin: user.admin,
      };

      const token = jwt.sign(payload, config.secret, {
        expiresIn: '1d',
      });

      res.json({
        success: true,
        message: 'Authentication succesful',
        token,
      });
    } else {
      res.json({ success: false, message: 'Authentication failed.' });
    }
  });
};
