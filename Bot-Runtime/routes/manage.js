/**
 * This module defines the endpoints
 * of the manage HTTP interface.
 *
 * @module routes/manage
 */

const express = require('express');

const router = express.Router();

const authController = require('../controllers/AuthController');
const botController = require('../controllers/BotController');
const userController = require('../controllers/UserController');

router.param('bot_id', botController.findBot);
router.param('user_id', userController.findUser);

router.use(authController.isAuthenticated);
router.use(authController.isAuthorized);

router.route('/bot')
  .get(botController.getBots)
  .post(botController.postBot);

router.route('/bot/:bot_id')
  .get(botController.getBot)
  .delete(botController.deleteBot)
  .patch(botController.updateBot);

router.route('/bot/:bot_id/start')
  .post(botController.startBot);

router.route('/bot/:bot_id/restart')
  .post(botController.restartBot);

router.route('/bot/:bot_id/stop')
  .post(botController.stopBot);

router.route('/users/')
  .post(authController.isAdmin, userController.postUser);

router.route('/users/:user_id')
  .get(userController.getUser);

module.exports = router;
