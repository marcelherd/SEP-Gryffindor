/**
 * This module implements the endpoints
 * of the manage/bot HTTP interface.
 *
 * @module controllers/BotController
 */

const Bot = require('../models/Bot');
const DockerService = require('../services/DockerService');

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
exports.postBot = function (req, res) {
  if (!req.body.name || !req.body.template || !req.body.greeting) {
    res.status(400).json({
      success: false,
      message: 'Body is missing one or more required parameters',
    });
  } else {
    const bot = new Bot({
      name: req.body.name,
      running: req.body.running || false,
      environment: req.body.environment || 'STAGING',
      template: req.body.template,
      greeting: req.body.greeting,
      dialogTree: req.body.dialogTree || {},
    });

    const newBot = req.user.bots.create(bot);
    req.user.bots.push(newBot);

    req.user.save((err) => {
      if (err) throw err;

      DockerService.buildImage(newBot);

      res.status(201).json({
        success: true,
        message: newBot,
      });
    });
  }
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
exports.updateBot = function (req, res) {
  const bot = req.user.bots.find(item => item.id === req.bot.id);

  bot.name = req.body.name || bot.name;
  bot.running = req.body.running || bot.running;
  bot.environment = req.body.environment || bot.environment;
  bot.greeting = req.body.greeting || bot.greeting;
  bot.dialogTree = req.body.dialogTree || bot.dialogTree;

  req.user.save((err) => {
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
