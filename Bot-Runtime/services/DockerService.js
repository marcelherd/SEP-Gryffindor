/**
 * This module is responsible for storing and retrieving
 * persistent bots and interacting with them.
 *
 * @module services/
 */
const fs = require('fs');
const Dockerode = require('dockerode');

const socketPath = (process.platform === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock');
const docker = new Dockerode({ socketPath });

/**
 * Creates and saves a new bot.
 *
 * @param {string} name - The name for the bot
 * @param {string} template - The template that is to be used for the bot
 * @returns {number} The id of the saved bot
 */
exports.buildImage = function (bot) {
  fs.writeFileSync(`../Bots/${bot.template}/config.json`, JSON.stringify(bot), 'utf8', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('file has been saved successfully');
    }
  });
  console.log('Building Bot...');
  return new Promise((resolve) => {
    docker.buildImage({
      context: `../Bots/${bot.template}`,
      src: ['Dockerfile', 'index.js', 'package.json', 'config.json'],
    }, {
      t: bot.id,
    }, (error, output) => {
      docker.modem.followProgress(output, onFinished, onProgress);
      function onFinished(err, result) {
        return new Promise((resolver) => {
          const createOptions = {
            name: `${bot._id}`,
            Image: `${bot._id}`,
            Tty: true,
            ExposedPorts: {
              '9999:': {},
            },
            HostConfig: {
              PortBindings: {
                '9999/tcp': [
                  {
                    HostIp: '127.0.0.1',
                    HostPort: '9999',
                  },
                ],
              },
            },
          };

          docker.createContainer(createOptions);
          resolver();
        });
      }
      function onProgress(err, result) {
      }
      if (error) {
        return console.error(error);
      }
      output.pipe(process.stdout);
    });
    resolve();
  });
};

/**
 * Starts the given bot.
 *
 * @param {Bot} bot - The bot that is to be started
 * @returns {Promise} TODO
 */
exports.start = function (bot) {
  return new Promise((resolve) => {
    // TODO: start the bot here
    console.log(`Starting bot ${bot.name} (${bot.id})...`);
    const container = docker.getContainer(bot.id);
    container.start();
    resolve();
  });
};


/**
 * Stops the given bot.
 *
 * @param {Bot} bot - The bot that is to be stopped
 * @returns {Promise} TODO
 */
exports.stop = function (bot) {
  return new Promise((resolve) => {
    // TODO: stop the bot here

    console.log(`Stopping bot ${bot.name} (${bot._id})...`);
    const container = docker.getContainer(bot.id);
    // query API for container info
    container.stop((err) => {
      if (err) {
        console.log(err);
      }
    });
    bot.status = 'false';
    console.log('Bot stopped');
    resolve();
  });
};

/**
 * Restarts the given bot.
 *
 * @param {Bot} bot - The bot that is to be restarted
 * @returns {Promise} TODO
 */
exports.restart = function (bot) {
  return new Promise((resolve) => {
    // TODO: restart the bot here
    console.log(`Restarting bot ${bot.name} (${bot.id})...`);
    resolve();
  });
};

/**
 * Deletes Image + Container of the given Bot.
 *
 * @param {Bot} bot - The bot that is to be started
 * @returns {Promise} TODO
 */
exports.delete = function (bot) {
  return new Promise((resolve) => {
    // TODO: start the bot here
    console.log(bot);
    console.log(`Deleting bot ${bot.name} (${bot.id})...`);

    const container = docker.getContainer(bot.id);
    this.stop(bot);
    container.remove((err) => {
      if (err) {
        console.log(err);
      }
    });
    const removeOptions = {
      force: true,
      noprune: false,
    };
    const image = docker.getImage(bot.id);
    image.remove(removeOptions, (err) => {
      if (err) {
        console.log(err);
      }
    });
    resolve();
  });
};
