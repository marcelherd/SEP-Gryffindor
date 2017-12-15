const User = require('../models/User');

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
