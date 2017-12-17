/**
 * The Bot database schema.
 *
 * @author Marcel Herd
 * @module models/Bot
 */

const mongoose = require('mongoose');

const { Schema } = mongoose;

module.exports = mongoose.model('Bot', new Schema({
  name: String,
  running: Boolean,
  environment: String,
  template: String,
  greeting: String,
  conversations: Number,
  forwards: Number,
  dialogTree: Object,
  intents: [{
    name: String,
    answer: {
      type: String,
      value: String,
    },
    utterances: [{
      text: String,
      intentName: String,
    }],
  }],
  endpointUrl: String,
  statusChanged: { $type: Date, default: new Date('2000-01-01').toISOString() },
}, {
  usePushEach: true,
  minimize: false,
  timestamps: true,
  typeKey: '$type',
}));
