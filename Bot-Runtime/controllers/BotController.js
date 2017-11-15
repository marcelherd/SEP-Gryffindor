/**
 * This module implements the endpoints
 * of the manage/bot HTTP interface.
 *
 * @module controllers/BotController
 */

const botService = require('../services/BotService');

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
  req.bot = botService.findById(parseInt(id, 10));

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
  const bots = botService.findAll();
  res.send(JSON.stringify(bots));
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
  // TODO: extract validation logic
  if (!req.body.name || !req.body.template) {
    res.status(400).send('Malformed data');
  } else {
    const { name, template } = req.body;
    const id = botService.save(name, template);

    // TODO: send a more useful response message?
    res.status(201).send(`${id}`);
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
  // TODO: handle internal errors
  botService.delete(req.bot);

  // TODO: send a more useful response message?
  res.send('Bot deleted');
};

/**
 * Updates the bot.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.updateBot = function (req, res) {
  // TODO: handle internal errors
  botService.update(req.bot, req.body);

  // TODO: send a more useful response message?
  res.send('Bot updated');
};

/**
 * Starts the bot.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.startBot = function (req, res) {
  // TODO: handle internal errors
  botService.start(req.bot);

  // TODO: send a more useful response message?
  res.send('Bot started');
};

/**
 * Stops the bot.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.stopBot = function (req, res) {
  // TODO: handle internal errors
  botService.stop(req.bot);

  // TODO: send a more useful response message?
  res.send('Bot stopped');
};

/**
 * Restarts the bot.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
exports.restartBot = function (req, res) {
  // TODO: handle internal errors
  botService.restart(req.bot);

  // TODO: send a more useful response message?
  res.send('Bot restarted');
};
