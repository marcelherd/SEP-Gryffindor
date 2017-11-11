const express = require('express');

const router = express.Router();

const authController = require('../controllers/AuthController');
const manageController = require('../controllers/ManageController');

router.param('bot_id', manageController.findBot);

router.route('/bot')
  .get(authController.isAuthenticated, manageController.getBots)
  .post(authController.isAuthenticated, manageController.postBot);

router.route('/bot/:bot_id')
  .get(authController.isAuthenticated, manageController.getBot)
  .delete(authController.isAuthenticated, manageController.deleteBot)
  .patch(authController.isAuthenticated, manageController.updateBot);

router.route('/bot/:bot_id/start')
  .post(authController.isAuthenticated, manageController.startBot);

router.route('/bot/:bot_id/restart')
  .post(authController.isAuthenticated, manageController.restartBot);

router.route('/bot/:bot_id/stop')
  .post(authController.isAuthenticated, manageController.stopBot);

module.exports = router;
