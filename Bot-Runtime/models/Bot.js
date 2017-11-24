const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model('Bot', new Schema({
  name: String,
  running: Boolean,
  environment: String,
  template: String,
  greeting: String,
  dialogTree: Object,
  statusChanged: { type: Date, default: new Date('2000-01-01').toISOString() },
}, { minimize: false, timestamps: true }));
