const utterances = require('./addUtterances');
const fse = require('fs-extra');
const path = require('path');

exports.train = async (config) => {
  try {
    console.log(config);
    const trainingPromise = utterances.sendUtteranceToApi({
      uri: config.uri,
      method: config.method, // Use POST to request training, GET to get training status
      headers: {
        'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey,
      },
      json: true,
      body: null, // The body can be empty for a training request
    });

    const results = await trainingPromise;

    if (config.method === 'POST') {
      const response = await fse.writeJson(path.join(__dirname, 'training-results.json'), results);
      console.log(`Training request sent. The status of the training request is: ${results.response.status}.`);
    } else if (config.method === 'GET') {
      const response = await fse.writeJson(path.join(__dirname, 'training-status-results.json'), results);
      console.log('Training status saved to file. ');
    }
  } catch (err) {
    console.log(`Error in Training:  ${err.message} `);
    // throw err;
  }
};
