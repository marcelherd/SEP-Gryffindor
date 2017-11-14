const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model('User', new Schema({
  name: String,
  password: String,
  admin: Boolean,
}));
