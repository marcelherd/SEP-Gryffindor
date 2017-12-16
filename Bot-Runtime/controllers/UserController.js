/**
 * This module implements the endpoints
 * of the manage/users HTTP interface.
 *
 * @author Marcel Herd
 * @module controllers/UserController
 */

const User = require('../models/User');

/**
 * Finds the corresponding user for the given ID
 * and attaches it to the given request object. (req.user)
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.findUser = function (req, res, next, id) {
  User.findById(id, (err, user) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'User does not exist',
      });
    }

    if (user) {
      req.user = user;
      return next();
    }

    return next('User not found');
  });
};

/**
 * Sends an HTTP response that contains all users as JSON. (HTTP 200)
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.getUsers = function (req, res) {
  User.find({ }, (err, users) => {
    if (err) throw err;

    res.json(users);
  });
};

/**
 * Creates a new user.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.postUser = function (req, res) {
  if (!req.body.username || !req.body.password) {
    res.status(400).json({
      success: false,
      message: 'Body is missing one or more required parameters',
    });
  } else {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      brandId: req.body.brandId || '',
      stagingId: req.body.stagingId || '',
      admin: req.body.admin || false,
      bots: [],
    });

    newUser.save((err) => {
      if (err) throw err;

      res.json({
        success: true,
        message: newUser,
      });
    });
  }
};

/**
 * Deletes the user.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.deleteUser = function (req, res) {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) throw err;

    res.json({
      success: true,
      message: 'User deleted',
    });
  });
};

/**
 * Sends an HTTP response that contains the user as JSON. (HTTP 200)
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.getUser = function (req, res) {
  res.json(req.user);
};

/**
 * Updates the user.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.updateUser = function (req, res) {
  req.user.brandId = req.body.brandId || req.user.brandId;
  req.user.stagingId = req.body.stagingId || req.user.stagingId;

  req.user.save((err) => {
    if (err) throw err;

    res.json({
      success: true,
      message: req.user,
    });
  });
};
