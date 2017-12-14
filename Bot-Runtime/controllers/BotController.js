/**
 * This module implements the endpoints
 * of the manage/bot HTTP interface.
 *
 * @module controllers/BotController
 */

const Bot = require('../models/Bot');
const DockerService = require('../services/DockerService');
const Luis = require('../services/LuisService');
const fs = require('fs');

/**
 * Finds the corresponding bot for the given ID
 * and attaches it to the given request object. (req.bot)
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 * @param {Callback} next - The next middleware
 * @param {string} id - The ID of the bot
 */
exports.findBot = function (req, res, next, id) {
  req.bot = req.user.bots.find(item => item.id === id);

  if (req.bot) {
    next();
  } else {
    // TODO: error handling
    next(new Error('Bot not found'));
  }
};

/**
 * Sends an HTTP response that contains all bots as JSON. (HTTP 200)
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.getBots = function (req, res) {
  res.send(JSON.stringify(req.user.bots));
};

/**
 * Creates and stores a bot using data from the request body.
 *
 * If successful, it sends an HTTP response that contains
 * the ID of the persisted bot. (HTTP 200)
 *
 * If unsuccessful, it sends HTTP 400.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.postBot = async function (req, res) {
  if (!req.body.name || !req.body.template || !req.body.greeting) {
    res.status(400).json({
      success: false,
      message: 'Body is missing one or more required parameters',
    });
  }
  const bot = new Bot({
    name: req.body.name,
    running: req.body.running || false,
    environment: req.body.environment || 'Staging',
    template: req.body.template,
    greeting: req.body.greeting,
    conversations: req.body.conversations || 0,
    forwards: req.body.forwards || 0,
    dialogTree: req.body.dialogTree || {
      root: {
        data: 'Conversation',
        children: [],
      },
    },
    intents: req.body.intents || [],
  });
  const newBot = req.user.bots.create(bot);
  req.user.bots.push(newBot);

  DockerService.buildContainer(bot, req.user._id);

  req.user.save((err) => {
    if (err) throw err;

    res.status(201).json({
      success: true,
      message: newBot,
    });
  });
};

/**
 * Sends an HTTP response that contains the bot as JSON. (HTTP 200)
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.getBot = function (req, res) {
  res.send(JSON.stringify(req.bot));
};

/**
 * Deletes the bot.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.deleteBot = function (req, res) {
  const index = req.user.bots.findIndex(item => item.id === req.bot.id);
  req.user.bots.splice(index, 1);

  DockerService.delete(req.bot);

  req.user.save((err) => {
    if (err) throw err;

    res.json({
      success: true,
      message: 'Bot deleted',
    });
  });
};

/**
 * Updates the bot.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.updateBot = async function (req, res) {
  const bot = req.user.bots.find(item => item.id === req.bot.id);

  bot.name = req.body.name || bot.name;
  bot.running = req.body.running || bot.running;
  bot.environment = req.body.environment || bot.environment;
  bot.greeting = req.body.greeting || bot.greeting;
  bot.dialogTree = req.body.dialogTree || bot.dialogTree;
  bot.intents = req.body.intents || bot.intents;

  fs.writeFileSync(`../Bots/${bot.template}/config.json`, JSON.stringify(bot), 'utf8', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('File has been saved successfully');
    }
  });

  if (bot.template === 'FAQ-Bot') {
    try {
      await Luis.createApp('../Bots/FAQ-Bot/config.json');
    } catch (err) {
      return res.json({
        success: false,
        message: err.message,
      });
    }
  }

  await DockerService.delete(bot);
  let data;
  do {
    data = await DockerService.buildContainer(bot, req.user._id);
  } while (data !== 'done');

  return req.user.save((err) => {
    if (err) throw err;

    res.json({
      success: true,
      message: bot,
    });
  });
};

/**
 * Starts the bot.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.startBot = function (req, res) {
  DockerService.start(req.bot).then(() => {
    req.bot.running = true;
    req.bot.statusChanged = new Date().toISOString();

    req.user.save((err) => {
      if (err) throw err;

      res.json({
        success: true,
        message: req.bot,
      });
    });
  });
};

/**
 * Stops the bot.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.stopBot = function (req, res) {
  DockerService.stop(req.bot).then(() => {
    req.bot.running = false;
    req.bot.statusChanged = new Date().toISOString();

    req.user.save((err) => {
      if (err) throw err;

      res.json({
        success: true,
        message: req.bot,
      });
    });
  });
};

/**
 * Restarts the bot.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.restartBot = function (req, res) {
  DockerService.restart(req.bot).then(() => {
    req.bot.running = true;
    req.bot.statusChanged = new Date().toISOString();

    req.user.save((err) => {
      if (err) throw err;

      res.json({
        success: true,
        message: req.bot,
      });
    });
  });
};

exports.conversation = function (req, res) {
  const bot = req.user.bots.find(item => item.id === req.bot.id);

  bot.conversations++;

  req.user.save((err) => {
    if (err) throw err;

    res.json({
      success: true,
      message: req.bot,
    });
  });
};

exports.forward = function (req, res) {
  const bot = req.user.bots.find(item => item.id === req.bot.id);

  bot.forwards++;

  req.user.save((err) => {
    if (err) throw err;

    res.json({
      success: true,
      message: req.bot,
    });
  });
};
