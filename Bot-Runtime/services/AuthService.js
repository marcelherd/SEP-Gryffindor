/**
 * Authentication-related service module.
 *
 * @author Marcel Herd
 * @module services/AuthService
 */

const User = require('../models/User');

/**
 * Creates a superuser if none exists.
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
        brandId: '85041411',
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
