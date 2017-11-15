/**
 * TODO
 *
 * @module controllers/UserController
 */

const User = require('../models/User');

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
