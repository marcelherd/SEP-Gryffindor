const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model('Bot', new Schema({
  name: String,
  running: Boolean,
  environment: String,
  template: String,
  greeting: String,
  dialogTree: Object,
}, { minimize: false }));
