/**
 * This module implements authentication middleware.
 *
 * @author Marcel Herd
 * @module controllers/AuthController
 */

const jwt = require('jsonwebtoken');

const config = require('../config');
const User = require('../models/User');

/**
 * Checks whether the request has a valid token attached.
 * If it has, it attaches the decoded token data to req.auth.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 * @param {Callback} next - The next middleware, if authentication was successful
 */
exports.isAuthenticated = function (req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return next(err);
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
 * A request is authorized if the logged-in user is an admin
 * or trying to access his own bots.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 * @param {Callback} next - The next middleware, if the request is authorized
 */
exports.isAuthorized = function (req, res, next) {
  const { _id, admin } = req.auth;

  // TODO: Implement this properly
  // Apparently express param resolves after the middleware,
  // which means that req.user is not available here..
  // Essentially we just authorize all requests.
  // This should be fixed.
  if (!req.user) {
    return next();
  }

  if (admin) {
    return next();
  }

  if (req.user._id === _id) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Permission denied',
  });
};

/**
 * Checks whether the user who is making the request is an admin.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 * @param {Callback} next - The next middleware, if the user is an admin
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
 * Authenticates a user and sends a token if succesful.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.authenticate = function (req, res) {
  User.findOne({
    username: req.body.username,
  }, (err, user) => {
    if (err) throw err;
    // Authentication successful?
    if (user && user.password === req.body.password) {
      // Create and send token
      const payload = {
        _id: user._id,
        username: user.username,
        admin: user.admin,
        brandId: user.brandId,
        stagingId: user.stagingId,
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
