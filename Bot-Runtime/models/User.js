/**
 * The User database schema.
 *
 * @author Marcel Herd
 * @module models/User
 */

const mongoose = require('mongoose');

const Bot = require('./Bot');

const { Schema } = mongoose;

module.exports = mongoose.model('User', new Schema({
  username: String,
  password: String,
  brandId: String,
  stagingId: String,
  admin: Boolean,
  bots: [Bot.schema],
}, { usePushEach: true, timestamps: true }));
