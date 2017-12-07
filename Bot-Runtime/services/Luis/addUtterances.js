

// node 7.x
// uses async/await - promises

const rp = require('request-promise');

exports.sendUtteranceToApi = async (options) => {
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

exports.addUtterance = async (config) => {
  let results;
  try {
    // Add an utterance
    const utterancePromise = this.sendUtteranceToApi({
      uri: config.uri,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey,
      },
      json: true,
      body: config.utterance,
    });
    results = await utterancePromise;
    console.log('Add utterance done');
  } catch (err) {
    throw err.message;
  }
  return results;
};
