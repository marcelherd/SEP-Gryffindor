/**
 * This module initially creates the Microsoft LUIS App
 * @author Simon Schwarz
 * @module services/Luis/createApp
 */


const rp = require('request-promise');

/**
 * posts the app with its configuration to Microsoft's API and awaits its results
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f
 *
 * @param {Object} config represent the config needed for the options for the post request including the app's name
 * @method callCreateApp method that actually posts the bot to the API
 * @returns {string} the App's id
 */
const createApp = async (config) => {
  try {
    const jsonBody = {
      name: config.appName,
      culture: config.culture,
    };
    const callCreateApp = async (options) => {
      try {
        let response;
        if (options.method === 'POST') {
          response = await rp.post(options);
        } else if (options.method === 'GET') {
          response = await rp.get(options);
        }
        return {
          response,
        };
      } catch (err) {
        throw err;
      }
    };
    const createAppPromise = callCreateApp({
      uri: config.uri,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey,
      },
      json: true,
      body: jsonBody,
    });

    const results = await createAppPromise;
    const appId = results.response;

    return appId;
  } catch (err) {
    return err;
  }
};


module.exports = createApp;
