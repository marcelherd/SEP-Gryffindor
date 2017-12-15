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
const fs = require('fs');

const config = require('./config');

const authenticateRoutes = require('./routes/authenticate');
const manageRoutes = require('./routes/manage');
const healthRoutes = require('./routes/health');

const authService = require('./services/AuthService');
const DockerService = require('./services/DockerService');

const templateFolder = '../Bots/';

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

// eager image building
try {
  fs.readdirSync(templateFolder).forEach((template) => {
    if (template !== 'package-lock.json') {
      DockerService.buildImage(template);
    }
  });
} catch (error) {
  throw error;
}

app.use('/api/v1/authenticate', authenticateRoutes);
app.use('/api/v1/manage', manageRoutes);
app.use('/health', healthRoutes);

const server = app.listen(3000, () => {
  console.log(figlet.textSync('Bottertoast'));
  console.log(' Bottertoast Runtime is running on port 3000!');
});

app.closeServer = () => {
  server.close();
};

module.exports = app;
