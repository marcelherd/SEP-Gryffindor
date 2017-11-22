/**
 * This module is responsible for storing and retrieving
 * persistent bots and interacting with them.
 *
 * @module services/
 */
const fs = require('fs');
const Dockerode = require('dockerode');

const docker = new Dockerode({ socketPath: '/var/run/docker.sock' });
let portCounter = 4001;

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
      console.log('File has been saved successfully');
    }
  });
  console.log('Building Bot...'+ bot.id);
  docker.buildImage({
    context: `../Bots/${bot.template}`,
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
 * @returns {Promise} TODO
 */
exports.start = function (bot) {
  bot.status = 'RUNNING';
  console.log('Building container...');
  return new Promise((resolve) => {
    let createOptions = {
    name: bot.id,
    Image: bot.id,
    Tty:true,
    ExposedPorts: {
        "8080:": {},
    },
    HostConfig: 
       {PortBindings: {'8080/tcp': [{HostIp: '127.0.0.1', HostPort: (++portCounter).toString }]}}
 
};
docker.createContainer(createOptions, function(err, bot){
  var container = docker.getContainer(bot.id);
  container.start(function(err, data){
    if(err) console.log(err);
  });

});
    resolve();
  });
  


}

/**
 * Stops the given bot.
 *
 * @param {Bot} bot - The bot that is to be stopped
 * @returns {Promise} TODO
 */
exports.stop = function (bot) {
  return new Promise((resolve) => {
    // TODO: stop the bot here
    console.log(`Stopping bot ${bot.name} (${bot.id})...`);
    var container = docker.getContainer(bot.id);
    
    // query API for container info
    container.stop(function (err, data) {
      if(err){
      console.log(err);
    }})
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
