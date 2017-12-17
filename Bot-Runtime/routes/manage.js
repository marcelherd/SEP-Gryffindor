/**
 * This module defines the endpoints
 * of the manage HTTP interface.
 *
 * @author Marcel Herd
 * @module routes/manage
 */
const express = require('express');

const router = express.Router();

const { JsonWebTokenError } = require('jsonwebtoken');

const authController = require('../controllers/AuthController');
const botController = require('../controllers/BotController');
const userController = require('../controllers/UserController');

router.param('user_id', userController.findUser);
router.param('bot_id', botController.findBot);

/**
 * This middleware checks whether the requested url starts with the given path.
 * If it does, it returns the next middleware in the chain.
 * Otherwise, it returns the middleware that has been passed in.
 *
 * @param {string} path - the path that the route starts with
 * @param {Callback} middleware - the middleware that is to be called if the path does not match
 * @return {Callback} the middleware that will be called next
 */
const unless = (path, middleware) => function (req, res, next) {
  return (req.path.startsWith(path) ? next() : middleware(req, res, next));
};

router.use(unless('/public', authController.isAuthenticated));
router.use(unless('/public', authController.isAuthorized));

// error handling
router.use((err, req, res, next) => {
  if (err instanceof JsonWebTokenError) {
    return res.status(403).json({
      success: false,
      message: 'Bad token',
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message,
  });
});

router.route('/users/')
  .get(authController.isAdmin, userController.getUsers)
  .post(authController.isAdmin, userController.postUser);

router.route('/users/:user_id')
  .get(userController.getUser)
  .delete(authController.isAdmin, userController.deleteUser)
  .patch(userController.updateUser);

router.route('/users/:user_id/bots')
  .get(botController.getBots)
  .post(botController.postBot);

router.route('/users/:user_id/bots/:bot_id')
  .get(botController.getBot)
  .delete(botController.deleteBot)
  .patch(botController.updateBot);

router.route('/users/:user_id/bots/:bot_id/start')
  .post(botController.startBot);

router.route('/users/:user_id/bots/:bot_id/restart')
  .post(botController.restartBot);

router.route('/users/:user_id/bots/:bot_id/stop')
  .post(botController.stopBot);

router.route('/public/users/:user_id/bots/:bot_id/conversation')
  .get(botController.conversation);

router.route('/public/users/:user_id/bots/:bot_id/forward')
  .get(botController.forward);

module.exports = router;
