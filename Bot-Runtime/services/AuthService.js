/**
 * TODO: documentation
 *
 * @module services/AuthService
 */

const User = require('../models/User');

/**
 * TODO: documentation
 */
exports.setupUsers = function () {
  User.findOne({
    username: 'superuser',
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      const superuser = new User({
        username: 'superuser',
        password: '123qwe',
        admin: true,
        bots: [],
      });

      superuser.save((saveErr) => {
        if (saveErr) throw saveErr;

        console.log('Superuser created.');
      });
    }
  });
};
