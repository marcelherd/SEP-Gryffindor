/**
 * This module is responsible for storing and retrieving
 * persistent bots and interacting with them.
 *
 * @module services/BotService
 */
const fs = require('fs');
const Dockerode = require('dockerode');

const docker = new Dockerode({ socketPath: '/var/run/docker.sock' });

/**
 * Creates and saves a new bot.
 *
 * @param {string} name - The name for the bot
 * @param {string} template - The template that is to be used for the bot
 * @returns {number} The id of the saved bot
 */
exports.save = function (bot) {
  fs.writeFileSync(`../Bot-Marketplace/${bot.template}/config.json`, JSON.stringify(bot), 'utf8', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('file has been saved successfully');
    }
  });
  console.log('Building Bot...');
  docker.buildImage({
    context: `../Bot-Marketplace/${bot.template}`,
    src: ['Dockerfile', 'index.js', 'package.json', 'config.json'],
  }, {
    t: bot.id,
  }, (error, output) => {
    if (error) {
      return console.error(error);
    }
    output.pipe(process.stdout);
  });
};

/**
 * Starts the given bot.
 *
 * @param {Bot} bot - The bot that is to be started
 */
exports.start = function (bot) {
  return new Promise((resolve) => {
    // TODO: start the bot here
    console.log(`Starting bot ${bot.name} (${bot.id})...`);
    resolve();
  });
};

/**
 * Stops the given bot.
 *
 * @param {Bot} bot - The bot that is to be stopped
 */
exports.stop = function (bot) {
  return new Promise((resolve) => {
    // TODO: stop the bot here
    console.log(`Stopping bot ${bot.name} (${bot.id})...`);
    resolve();
  });
};

/**
 * Restarts the given bot.
 *
 * @param {Bot} bot - The bot that is to be restarted
 */
exports.restart = function (bot) {
  return new Promise((resolve) => {
    // TODO: restart the bot here
    console.log(`Restarting bot ${bot.name} (${bot.id})...`);
    resolve();
  });
};
