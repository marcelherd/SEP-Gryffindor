/**
 * This module is responsible for storing and retrieving
 * persistent bots and interacting with them.
 *
 * @module services/BotService
 */

const cache = require('../cache');

// TODO: move this to its own class
/**
 * @typedef {Object} Bot
 * @property {number} id - The id of the bot
 * @property {string} name - The name of the bot
 * @property {string} template - The template of the bot
 * @property {string} status - The status of the bot
 */

/**
 * Returns the bot with the given id.
 *
 * @param {number} id - The id of the target bot
 */
exports.findById = function (id) {
  return cache.bots.find(item => item.id === id);
};

/**
 * Returns all bots.
 *
 * @returns {Bot[]} All bots
 */
exports.findAll = function () {
  return cache.bots;
};

/**
 * Creates and saves a new bot.
 *
 * @param {string} name - The name for the bot
 * @param {string} template - The template that is to be used for the bot
 * @returns {number} The id of the saved bot
 */
exports.save = function (name, template, tree, greeting) {
  const bot = {
    id: ++cache.currentId,
    name,
    template,
    tree,
    greeting,
    status: 'NOT_RUNNING',
  };

  cache.bots.push(bot);

  return bot.id;
};

/**
 * Deletes the given bot.
 *
 * @param {Bot} bot - The bot that is to be deleted
 */
exports.delete = function (bot) {
  const index = cache.bots.findIndex(item => item.id === bot.id);

  // TODO: stop the bot, if it is running

  cache.bots.splice(index, 1);
};

/**
 * Updates the given bot.
 *
 * @param {Bot} bot - The bot that is being updated
 * @param {Object} props - The properties that are being updated
 * @param {string} props.name - The name of the bot
 */
exports.update = function (bot, { name, tree, greeting }) {
  // TODO: update all other properties as well
  bot.name = name;
  bot.tree = tree;
  bot.greeting = greeting;
};

/**
 * Starts the given bot.
 *
 * @param {Bot} bot - The bot that is to be started
 */
exports.start = function (bot) {
  // TODO: actually start the bot
  // TODO: should probably be separate from DB logic
  bot.status = 'RUNNING';
};

/**
 * Stops the given bot.
 *
 * @param {Bot} bot - The bot that is to be stopped
 */
exports.stop = function (bot) {
  // TODO: actually stop the bot
  // TODO: should probably be separate from DB logic
  bot.status = 'NOT_RUNNING';
};

/**
 * Restarts the given bot.
 *
 * @param {Bot} bot - The bot that is to be restarted
 */
exports.restart = function (bot) {
  // TODO: actually restart the bot
  bot.status = 'RUNNING';
};
