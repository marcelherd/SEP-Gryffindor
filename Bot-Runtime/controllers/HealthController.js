/**
 * This module implements the health check endpoint.
 *
 * @author Marcel Herd
 * @module controllers/HealthController
 */

const User = require('../models/User');

/**
 * Sends HTTP 200 if the container is running properly.
 * Sends HTTP 500 otherwise, including a message with further information.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.checkHealth = function (req, res) {
  User.find({}, (err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Can not reach database',
      });
    }

    if (users.length < 1) {
      return res.status(500).json({
        success: false,
        message: 'No users set up',
      });
    }

    return res.json({
      success: true,
      message: 'Container is running properly',
    });
  });
};
