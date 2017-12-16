/**
 * Bot marketplace application entry point.
 *
 * This module implements the /discover HTTP interface.
 *
 * @author Marcel Herd
 * @module index
 */

const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const figlet = require('figlet');

const discoveryService = require('./services/DiscoveryService');

const app = express();

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(cors());

app.use(morgan('dev'));

app.get('/api/v1/discover', (req, res) => {
  const templates = discoveryService.getTemplates();
  res.json(templates);
});

const server = app.listen(4000, () => {
  console.log(figlet.textSync('Bottertoast'));
  console.log('Bottertoast Marketplace is running on port 4000!\n');
});

exports.closeServer = () => {
  server.close();
};
