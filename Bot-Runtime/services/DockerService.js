/**
 * This module is responsible for storing and retrieving
 * persistent bots and interacting with them.
 * @author Dario Capuana
 * @module services/
 */
const Dockerode = require('dockerode');


const socketPath = (process.platform === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock');
const docker = new Dockerode({ socketPath });
const tar = require('tar-fs');

let createOptions;

exports.buildImage = async function (template) {
  const path = `../Bots/${template}`;
  const tarStream = tar.pack(path);

  docker.buildImage(tarStream, {
    t: ((template).toLowerCase()),
  }, (error, output) => {
    docker.modem.followProgress(output, onFinished, onProgress);
    async function onFinished() {
      return 'done';
    }
    function onProgress() {
    }
    if (error) {
      return error;
    }
    output.pipe(process.stdout);
  });
};
/**
 * Creates and saves a new bot.
 *
 * @param {string} name - The name for the bot
 * @param {string} template - The template that is to be used for the bot
 * @returns {promise} - When Image is fully built
 */
exports.buildContainer = async function (bot, userId, endpointUrl) {
  console.log('Building Bot...');
  if (endpointUrl === undefined) {
    endpointUrl = 'noEndpoint';
  } else {
    endpointUrl = JSON.stringify(endpointUrl);
  }
  createOptions = {
    name: `${bot._id}`,
    Image: ((bot.template).toLowerCase()),
    Tty: true,
    Env: [`NODE_ENV_CONFIG=${JSON.stringify(bot)}`, `NODE_ENV_ENDPOINT=${endpointUrl}`,
      `NODE_ENV_USER=${JSON.stringify(userId)}`, `NODE_ENV_HOST=${process.env.HOST}`, `NODE_ENV_SUBSCRIPTION_KEY=${process.env.SUBSCRIPTION_KEY}`],
    restartPolicy: {
      Name: 'on-failure',
      MaximumRetryCount: 0,
    },
    NetworkMode: 'sepgryffindor_bottertoast',
  };
  docker.createContainer(createOptions);
  return 'done';
};

/**
 * Starts the given bot.
 *
 * @param {Bot} bot - The bot that is to be started
 * @returns {Promise} TODO
 */
exports.start = async function (bot) {
// TODO: start the bot here
  console.log(`Starting bot ${bot.name} (${bot.id})...`);
  const container = docker.getContainer(bot.id);
  container.inspect((error, data) => {
    if (data !== null) {
      if (data.State.Status === 'exited' || data.State.Status === 'created') {
        container.start();
        console.log(`Bot ${bot.name} (${bot.id}) started succesfully`);
        bot.status = 'running';
      }
    } else {
      console.log('No container to delete ;-)');
    }
  });
};


/**
 * Stops the given bot.
 *
 * @param {Bot} bot - The bot that is to be stopped
 * @returns {Promise} - When Bot is stopped
 */
exports.stop = async function (bot) {
  console.log(`Stopping bot ${bot.name} (${bot._id})...`);
  const container = docker.getContainer(bot.id);
  // query API for container info
  container.inspect((error, data) => {
    if (data && data.State && data.State.Status !== 'exited' && data.State.Status !== 'created') {
      container.stop((err) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Bot ${bot.name} (${bot._id}) stopped`);
          bot.status = 'false';
          return 'done';
        }
      });
    }
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
exports.delete = async function (bot) {
  // TODO: start the bot here
  console.log(bot);
  console.log(`Deleting bot ${bot.name} (${bot._id})...`);


  const container = docker.getContainer(bot._id);
  try {
    await this.stop(bot);
    const data = await container.remove();
    return data;
  } catch (err) {
    console.log(err);
  }
};
