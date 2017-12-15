const request = require('requestretry');

// time delay between requests
const delayMS = 1000;

// retry recount
const maxRetry = 5;

// retry request if error or 429 received
const retryStrategy = function (err, response, body) {
  const shouldRetry = err || (response.statusCode === 429);
  if (shouldRetry) console.log('retrying add intent...');
  return shouldRetry;
};

/**
 * posts the app wiht its configuration to Microsoft's API and awaits its results
 * @param config represent the config needed for the options for the post request including the app's name
 * @method callCreateApp actually posts the bot to the API
 * @return the app's id
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

// Send JSON as the body of the POST request to the API
const callAddIntent = async (options) => {
  try {
    const response = await request(options);
    return { response };
  } catch (err) {
    console.log(`Error in callAddIntent:  ${err.message} `);
  }
};

module.exports = addIntents;
