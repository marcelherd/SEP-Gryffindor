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

// Looks up the bot with the given id and attaches it to the request
router.param('bot_id', botController.findBot);

router.param('user_id', userController.findUser);

router.route('/bot')
  .get(authController.isAuthenticated, botController.getBots)
  .post(authController.isAuthenticated, botController.postBot);

router.route('/bot/:bot_id')
  .get(authController.isAuthenticated, botController.getBot)
  .delete(authController.isAuthenticated, botController.deleteBot)
  .patch(authController.isAuthenticated, botController.updateBot);

router.route('/bot/:bot_id/start')
  .post(authController.isAuthenticated, botController.startBot);

router.route('/bot/:bot_id/restart')
  .post(authController.isAuthenticated, botController.restartBot);

router.route('/bot/:bot_id/stop')
  .post(authController.isAuthenticated, botController.stopBot);

router.route('/users/')
  .post(authController.isAuthenticated, authController.isAdmin, userController.postUser);

router.route('/users/:user_id')
  .get(authController.isAuthenticated, authController.isAuthorized, userController.getUser);

module.exports = router;
