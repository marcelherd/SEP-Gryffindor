/**
 * This module is responsible for storing and retrieving
 * persistent bots and interacting with them.
 *
 * @module services/
 */
const Dockerode = require('dockerode');


const socketPath = (process.platform === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock');
const docker = new Dockerode({ socketPath });
const fileService = require('./FileService');
const tar = require('tar-fs');

let createOptions;

/**
* Creates the Docker Images
*
* @param {string} name - The name for the bot
* @param {string} template - The template that is to be used for the bot
* @returns {promise} - When Image is fully built
*/


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
exports.buildContainer = async function (bot, userId) {
  console.log('Building Bot...');
  console.log(JSON.stringify(bot));
  if (bot.template === 'FAQ-Bot') {
    console.log(bot);
    const endpointData = await fileService.readConfigDataFromFile('services/Luis', 'endpoint.json');
    createOptions = {
      name: `${bot._id}`,
      Image: ((bot.template).toLowerCase()),
      Tty: true,
      Env: [`NODE_ENV=${JSON.stringify(bot)}`, `NODE_ENV2=${JSON.stringify(endpointData)}`, `NODE_ENV_USER=${JSON.stringify(userId)}`],
    };
    console.log(createOptions);
  } else {
    createOptions = {
      name: `${bot._id}`,
      Image: ((bot.template).toLowerCase()),
      Tty: true,
      Env: [`NODE_ENV=${JSON.stringify(bot)}`, `NODE_ENV_USER=${JSON.stringify(userId)}`],
    };
  }
  console.log('HERE I SHOULD CREATE THE CONTAINER!');
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
        return 'done';
      }
    } else {
      console.log('No container to delete ;-)');
      throw new Error('couldnt start');
    }
  });
};

/**
 * Stops the given bot.
 *
 * @param {Bot} bot - The bot that is to be stopped
 * @returns {Promise} TODO
 */
exports.stop = async function (bot) {
  // TODO: stop the bot here

  console.log(`Stopping bot ${bot.name} (${bot._id})...`);
  const container = docker.getContainer(bot.id);
  // query API for container info
  container.inspect((error, data) => {
    console.log(data);
    if (data && data.State && data.State.Status !== 'exited') {
      container.stop((err) => {
        if (err) {
          console.log(err);
        } else {
          (console.log(`Bot ${bot.name} (${bot._id}) stopped`));
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
