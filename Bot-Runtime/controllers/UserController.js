/**
 * TODO: documentation
 *
 * @module controllers/UserController
 */

const User = require('../models/User');

/**
 * TODO: documentation
 *
 * @param {*} req
 * @param {*} res
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
 * TODO: documentation
 *
 * @param {*} req
 * @param {*} res
 */
exports.getUsers = function (req, res) {
  User.find({ }, (err, users) => {
    if (err) throw err;

    res.json(users);
  });
};

/**
 * TODO: documentation
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
 * TODO: documentation
 *
 * @param {*} req
 * @param {*} res
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
 * TODO: documentation
 *
 * @param {*} req
 * @param {*} res
 */
exports.getUser = function (req, res) {
  res.json(req.user);
};

/**
 * TODO: documentation
 *
 * @param {*} req
 * @param {*} res
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
