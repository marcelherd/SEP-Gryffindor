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
    if (err) return next(err);

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
  const { username, password, admin } = req.body;

  const newUser = new User({
    username, password, admin,
  });

  newUser.save((err, user) => {
    res.json({
      success: true,
      id: user._id,
    });
  });
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
