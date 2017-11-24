const mongoose = require('mongoose');

const Bot = require('./Bot');

const { Schema } = mongoose;

module.exports = mongoose.model('User', new Schema({
  username: String,
  password: String,
  admin: Boolean,
  bots: [Bot.schema],
}, { usePushEach: true, timestamps: true }));
