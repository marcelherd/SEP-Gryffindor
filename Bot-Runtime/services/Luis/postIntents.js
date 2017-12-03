const rp = require('request-promise');
const fse = require('fs-extra');
const path = require('path');
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

// Call add-intents
const addIntents = async (config) => {
  const intentPromises = [];
  config.uri = config.uri.replace('{appId}', config.LUIS_appId).replace('{versionId}', config.LUIS_versionId);

  config.intentList.forEach((intent) => {
    config.intentName = intent.name;
    try {
      // JSON for the request body
      let jsonBody = {
        'name': config.intentName,
      };

      // Create an intent
      let addIntentPromise = callAddIntent({
        // uri: config.uri,
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

      console.log(`Called addIntents for intent named ${intent}.`);
    } catch (err) {
      console.log(`Error in addIntents:  ${err.message} `);
    }
  }, this);

  const results = await Promise.all(intentPromises);
  console.log(`Results of all promises = ${JSON.stringify(results)}`);
  const response = results;
};

// Send JSON as the body of the POST request to the API
var callAddIntent = async (options) => {
  try {
    let response;
    response = await request(options);
    return { response };
  } catch (err) {
    console.log(`Error in callAddIntent:  ${err.message} `);
  }
};

module.exports = addIntents;
