/**
 * This module is responsible for storing and retrieving
 * persistent bots and interacting with them.
 *
 * @module services/BotService
 */
const fs = require('fs');
const cache = require('../cache');
<<<<<<< HEAD
const dockerode = require('dockerode');
let docker = new dockerode({ socketPath: '/var/run/docker.sock' });
=======
const Dockerode = require('dockerode');

const docker = new Dockerode({ socketPath: '/var/run/docker.sock' });
>>>>>>> cd5fecf5b38bae7fc2dea395094bdd491fc72c5a
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
<<<<<<< HEAD
  fs.writeFileSync('../Bot-Marketplace/' + template + '/config.json', JSON.stringify(bot), 'utf8', function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("file has been saved successfully");
=======
  fs.writeFileSync(`../Bot-Marketplace/${template}/config.json`, JSON.stringify(bot), 'utf8', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('file has been saved successfully');
>>>>>>> cd5fecf5b38bae7fc2dea395094bdd491fc72c5a
    }
  });
  console.log('Building Bot...');
  docker.buildImage({
<<<<<<< HEAD
    context: '../Bot-Marketplace/' + template,
    src: ['Dockerfile', 'index.js', 'package.json', 'config.json']
  }, {
      t: bot.id
    }, function (error, output) {
      if (error) {
        return console.error(error);
      }
      output.pipe(process.stdout);
      console.log('Bot built');
    });
=======
    context: `../Bot-Marketplace/${template}`,
    src: ['Dockerfile', 'index.js', 'package.json', 'config.json'],
  }, {
    t: bot.id,
  }, (error, output) => {
    if (error) {
      return console.error(error);
    }
    output.pipe(process.stdout);
  });
>>>>>>> cd5fecf5b38bae7fc2dea395094bdd491fc72c5a
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
  console.log('Building container...');
  // docker.createContainer({
  //   Image: JSON.stringify(bot.id),
  // }).then(function(container) {
  //   return container.start();
  docker.createContainer({ Image: JSON.stringify(bot.id) }, function (err, container) {
    container.start({
      "PortBindings": {
        "9999/tcp": [
          { "HostPort": "9999" }
        ]
      }
    }, function (err, data) {
    }
    )
  });
}



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
