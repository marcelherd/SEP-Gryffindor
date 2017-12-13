/**
 * Application entry point.
 *
 * @module index
 */

const express = require('express');
const parser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const figlet = require('figlet');

const config = require('./config');

const authenticateRoutes = require('./routes/authenticate');
const manageRoutes = require('./routes/manage');

const authService = require('./services/AuthService');

const app = express();

app.set('secret', config.secret);

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(cors());

app.use(morgan('dev'));

mongoose.connect(config.database, config.databaseOptions);
mongoose.Promise = global.Promise;

// creates a superuser if it doesn't exist
authService.setupUsers();

app.use('/api/v1/authenticate', authenticateRoutes);
app.use('/api/v1/manage', manageRoutes);

app.listen(3000, () => {
  console.log(figlet.textSync('Bottertoast'));
  console.log(' Bottertoast Runtime is running on port 3000!');
});

module.exports = app;
