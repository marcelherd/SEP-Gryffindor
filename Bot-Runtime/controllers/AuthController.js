/**
 * This module implements authentication middleware.
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
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        res.status(403).json({
          success: false,
          message: 'Bad token',
        });
      }

      req.auth = decoded;
      return next();
    });
  } else {
    res.status(403).json({
      success: false,
      message: 'No token provided',
    });
  }
};

/**
 * Checks whether the request is authorized.
 * A request is authorized if the logged in user is an admin
 * or trying to access his own bots.
 *
 * TODO: documentation
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.isAuthorized = function (req, res, next) {
  const { id, admin } = req.auth;

  // TODO: documentation
  if (!req.user) {
    return next();
  }

  // Admins are always authorized
  if (admin) {
    return next();
  }

  if (req.user.id === id) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Permission denied',
  });
};

/**
 * TODO: documentation
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.isAdmin = function (req, res, next) {
  const { admin } = req.auth;

  if (admin) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Permission denied',
  });
};

/**
 * Authenticates a user and sends a Token if succesful.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.authenticate = function (req, res) {
  User.findOne({
    username: req.body.username,
  }, (err, user) => {
    if (err) throw err;

    // Authentication successful
    if (user && user.password === req.body.password) {
      // Create and send token
      const payload = {
        _id: user._id,
        username: user.username,
        admin: user.admin,
      };

      const token = jwt.sign(payload, config.secret, {
        expiresIn: '1d',
      });

      res.json({
        success: true,
        message: 'Authentication succesful',
        user: payload,
        token,
      });
    } else {
      res.status(401).json({ success: false, message: 'Authentication failed.' });
    }
  });
};
