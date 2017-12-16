/**
 * This module add thes intents to the Microsoft LUIS App
 *
 * @module services/Luis/postIntents
 */

const request = require('requestretry');

// time delay between requests
const delayMS = 1000;

// retry recount
const maxRetry = 5;
/**
 * retry request if error or 429 received
 */
const retryStrategy = function (err, response, body) {
  const shouldRetry = err || (response.statusCode === 429);
  if (shouldRetry) console.log('retrying add intent...');
  return shouldRetry;
};

/**
 * Send JSON as the body of the POST request to Microsoft's API
 * @param options Options needed for the request
 * @returns {string} The ID of the created model
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0c
 */
const callAddIntent = async (options) => {
  try {
    const response = await request(options);
    return { response };
  } catch (err) {
    console.log(`Error in callAddIntent:  ${err.message} `);
  }
};
/**
 * posts the app with its configuration to Microsoft's API and awaits its results
 * @param config represent the config needed for the options for the post request including the app's name
 * @method callCreateApp actually posts the bot to the API
 * @returns {string} The ID of the created model
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0c
 */
const addIntents = async (config) => {
  const intentPromises = [];
  config.uri = config.uri.replace('{appId}', config.LUIS_appId).replace('{versionId}', config.LUIS_versionId);

  config.intentList.forEach((intent) => {
    config.intentName = intent.name;
    try {
      const jsonBody = {
        name: config.intentName,
      };

      const addIntentPromise = callAddIntent({
        url: config.uri,
        fullResponse: false,
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey,
        },
        json: true,
        body: jsonBody,
        maxAttempts: maxRetry,
        retryDelay: delayMS,
        retryStrategy,
      });
      intentPromises.push(addIntentPromise);
    } catch (err) {
      console.log(`Error in addIntents:  ${err.message} `);
    }
  }, this);

  const results = await Promise.all(intentPromises);
};

module.exports = addIntents;
