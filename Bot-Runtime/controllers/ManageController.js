const cache = require('../cache');

exports.findBot = function (req, res, next, id) {
  const bot = cache.bots.find(item => item.id === parseInt(id, 10));

  req.bot = bot;
  next();
};

exports.getBots = function (req, res) {
  res.send(JSON.stringify(cache.bots));
};

exports.postBot = function (req, res) {
  if (!req.body.name || !req.body.template) {
    res.status(400).send('Malformed data');
  } else {
    const newBot = {
      id: ++cache.currentId,
      name: req.body.name,
      template: req.body.template,
      status: 'NOT_RUNNING',
    };

    cache.bots.push(newBot);

    res.status(201).send('Bot saved');
  }
};

exports.getBot = function (req, res) {
  if (req.bot === undefined) {
    res.status(404).send('Not found');
  } else {
    res.send(JSON.stringify(req.bot));
  }
};

exports.deleteBot = function (req, res) {
  const index = cache.bots.findIndex(item => item.id === req.bot.id);

  if (index === -1) {
    res.status(404).send('Not found');
  } else {
    // TODO: stop the bot, if it is running
    cache.bots.splice(index, 1);
    res.send('Bot deleted');
  }
};

exports.updateBot = function (req, res) {
  if (req.bot === undefined) {
    res.status(404).send('Not found');
  } else {
    // TODO update all other properties as well
    req.bot.name = req.body.name;
    res.send(JSON.stringify(req.bot));
  }
};

exports.startBot = function (req, res) {
  if (req.bot === undefined) {
    res.status(404).send('Not found');
  } else {
    // TODO: start the bot
    req.bot.status = 'RUNNING';
    res.send(JSON.stringify(req.bot));
  }
};

exports.restartBot = function (req, res) {
  // TODO: maybe this should simply call stop and then start :D
  if (req.bot === undefined) {
    res.status(404).send('Not found');
  } else {
    // TODO: restart the bot
    req.bot.status = 'NOT_RUNNING';
    req.bot.status = 'RUNNING';
    res.send(JSON.stringify(req.bot));
  }
};

exports.stopBot = function (req, res) {
  if (req.bot === undefined) {
    res.status(404).send('Not found');
  } else {
    // TODO: stop the bot
    req.bot.status = 'NOT_RUNNING';
    res.send(JSON.stringify(req.bot));
  }
};
