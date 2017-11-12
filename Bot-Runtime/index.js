/**
 * Application entry point.
 *
 * @module index
 */

const express = require('express');

const app = express();

require('./config')(app);

const manageRoutes = require('./routes/manage');

app.use('/api/v1/manage', manageRoutes);

app.listen(3000, () => {
  console.log('Bot Runtime is running on port 3000!');
});
