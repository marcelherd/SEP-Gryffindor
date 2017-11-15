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

const config = require('./config');
const authenticateRoutes = require('./routes/authenticate');
const manageRoutes = require('./routes/manage');

const app = express();

app.set('secret', config.secret);

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(cors());

app.use(morgan('dev'));

mongoose.connect(config.database, config.databaseOptions);

app.use('/api/v1/authenticate', authenticateRoutes);
app.use('/api/v1/manage', manageRoutes);

app.listen(3000, () => {
  console.log('Bot Runtime is running on port 3000!');
});
