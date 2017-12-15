const rp = require('request-promise');

/**
 * posts the utterances of your LUIS app to Microsoft's API
 * @param options represent the options needed for the post request
 * @return Microsoft Luis' response to the post request
 */
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

/**
 * awaits the post of all utterances request to the microsoft API
 * is the main method to be called from outside
 * @param config represent the config needed for the post request's options including all the utterances
 * @return Microsoft Luis response to the post request
 */
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
  } catch (err) {
    throw err.message;
  }
  return results;
};
