/**
 * Bot marketplace application entry point.
 *
 * This module implements the /discover HTTP interface.
 *
 * @module index
 */

const express = require('express');
const parser = require('body-parser');
const cors = require('cors');

const discoveryService = require('./services/DiscoveryService');

const app = express();

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(cors());

/**
 * Responds with a JSON array containing all available bot templates.
 *
 * @param {Request} req - The HTTP request
 * @param {Response} res - The HTTP response
 */
app.get('/api/v1/discover', (req, res) => {
  const templates = discoveryService.getTemplates();
  res.json(templates);
});

app.listen(4000, () => {
  console.log('Bot Marketplace is running on port 4000!');
});
