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
  console.log('Building Bot...');
  return new Promise((resolve) => {
    console.log(JSON.stringify(bot));
    const createOptions = {
      name: `${bot._id}`,
      Image: ((bot.template).toLowerCase()),
      Tty: true,
      Env: [`NODE_ENV=${JSON.stringify(bot)}`],
    };
    docker.createContainer(createOptions, (err) => {
      if (err) {
        docker.buildImage({
          context: `../Bots/${bot.template}`,
          src: ['Dockerfile', 'index.js', 'package.json'],
        }, {
          t: ((bot.template).toLowerCase()),
        }, (error, output) => {
          docker.modem.followProgress(output, onFinished, onProgress);
          function onFinished() {
            docker.createContainer(createOptions);
          }
          function onProgress() {
          }
          if (error) {
            return console.error(error);
          }
          output.pipe(process.stdout);
        });
      }
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
    container.inspect((error, data) => {
      if (data.State.Status === 'exited' || data.State.Status === 'created') {
        container.start();
        console.log(`Bot ${bot.name} (${bot.id}) started succesfully`);
        bot.status = 'running';
      }
    });
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
    container.inspect((error, data) => {
      if (data.State.Status !== 'exited') {
        container.stop((err) => {
          if (err) {
            console.log(err);
          } else {
            (console.log(`Bot ${bot.name} (${bot._id}) stopped`));
            bot.status = 'false';
          }
        });
      }
    });
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
    console.log(`Deleting bot ${bot.name} (${bot._id})...`);


    const container = docker.getContainer(bot._id);
    this.stop(bot);
    container.remove((err) => {
      if (err) {
        console.log(err);
      }
    });
    resolve();
  });

  /*
    const container = docker.getContainer(bot.id);
    console.log(container);
    this.stop(bot).then(container.remove()).catch((err) => {
      console.log(err);
    });
    resolve();
  });
  */
};
