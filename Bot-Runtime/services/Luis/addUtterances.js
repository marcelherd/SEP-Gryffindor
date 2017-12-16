/**
 * This module adds adds all utterances to the Luis Application
 *
 * @module services/Luis/addIntents
 */

const rp = require('request-promise');

/**
 * posts the utterances of your LUIS app to Microsoft's API
 * @param options - represent the options needed for the post request
 * @returns {Promise} The ID of the created example
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c08
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
 * awaits the post of all utterances request to the microsoft API.
 * It is the main method to be called from outside
 * @param config - represent the config needed for the post request's options including all the utterances
 * @returns {Promise} The ID of the created example.
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c08
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
