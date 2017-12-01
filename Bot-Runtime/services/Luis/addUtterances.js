// node 7.x
// uses async/await - promises

const rp = require('request-promise');
const path = require('path');

const sendUtteranceToApi = async (options) => {
  try {
    let response;
    if (options.method === 'POST') {
      response = await rp.post(options);
    } else if (options.method === 'GET') {
      response = await rp.get(options);
    }

    return { request: options.body, response };
  } catch (err) {
    throw err;
  }
};

const addUtterance = async (config) => {
  try {
    // Add an utterance
    const utterancePromise = sendUtteranceToApi({
      uri: config.uri,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey,
      },
      json: true,
      body: config.utterance,
    });

    const results = await utterancePromise;
    console.log(results);

    console.log('Add utterance done');
  } catch (err) {
    console.log(`Error adding utterance:  ${err.message} `);
    // throw err;
  }
};

module.exports = addUtterance;
