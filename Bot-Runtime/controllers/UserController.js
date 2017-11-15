/**
 * TODO
 *
 * @module controllers/UserController
 */

const User = require('../models/User');

/**
 * TODO
 *
 * @param {*} req
 * @param {*} res
 */
exports.findUser = function (req, res, next, id) {
  User.findById(id, (err, user) => {
    if (err) throw err;

    if (user) {
      req.user = user;
      return next();
    }

    return next('User not found');
  });
};

/**
 * TODO
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.postUser = function (req, res) {
  const { name, password, admin } = req.body;

  const newUser = new User({
    name, password, admin,
  });

  newUser.save((err, user) => {
    res.json({
      success: true,
      id: user._id,
    });
  });
};

/**
 * TODO
 *
 * @param {*} req
 * @param {*} res
 */
exports.getUser = function (req, res) {
  res.json(req.user);
};
