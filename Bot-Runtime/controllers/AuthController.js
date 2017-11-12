/**
 * This module contains authentication middleware.
 *
 * @module controllers/AuthController
 */

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
