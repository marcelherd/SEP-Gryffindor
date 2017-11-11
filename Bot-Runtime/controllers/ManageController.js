const botService = require('../services/BotService');

exports.findBot = function (req, res, next, id) {
  req.bot = botService.findById(parseInt(id, 10));

  if (req.bot) {
    next();
  } else {
    // TODO: error handling
    next(new Error('Bot not found'));
  }
};

exports.getBots = function (req, res) {
  const bots = botService.findAll();
  res.send(JSON.stringify(bots));
};

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

exports.getBot = function (req, res) {
  res.send(JSON.stringify(req.bot));
};

exports.deleteBot = function (req, res) {
  // TODO: handle internal errors
  botService.delete(req.bot);

  // TODO: send a more useful response message?
  res.send('Bot deleted');
};

exports.updateBot = function (req, res) {
  // TODO: handle internal errors
  botService.update(req.bot, req.body);

  // TODO: send a more useful response message?
  res.send('Bot updated');
};

exports.startBot = function (req, res) {
  // TODO: handle internal errors
  botService.start(req.bot);

  // TODO: send a more useful response message?
  res.send('Bot started');
};

exports.stopBot = function (req, res) {
  // TODO: handle internal errors
  botService.stop(req.bot);

  // TODO: send a more useful response message?
  res.send('Bot stopped');
};

exports.restartBot = function (req, res) {
  // TODO: handle internal errors
  botService.restart(req.bot);

  // TODO: send a more useful response message?
  res.send('Bot restarted');
};
