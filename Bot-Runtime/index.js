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
const fs = require('fs');


const config = require('./config');

const authenticateRoutes = require('./routes/authenticate');
const manageRoutes = require('./routes/manage');

const authService = require('./services/AuthService');
const DockerService = require('./services/DockerService');

const app = express();
const testFolder = '../Bots/';

app.set('secret', config.secret);

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(cors());

app.use(morgan('dev'));

mongoose.connect(config.database, config.databaseOptions);
mongoose.Promise = global.Promise;

// creates a superuser if it doesn't exist
authService.setupUsers();

// eager image building
try {
  fs.readdirSync(testFolder).forEach((file) => {
    DockerService.buildImage(file);
  });
} catch (error) {
  throw error;
}

app.use('/api/v1/authenticate', authenticateRoutes);
app.use('/api/v1/manage', manageRoutes);

app.listen(3000, () => {
  console.log('Bottertoast Runtime is running on port 3000!');
});

module.exports = app;
