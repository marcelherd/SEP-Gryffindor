const rp = require('request-promise');

/**
 * posts the app wiht its configuration to Microsoft's API and awaits its results
 * @param config represent the config needed for the options for the post request including the app's name
 * @method callCreateApp actually posts the bot to the API
 * @return the app's id
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
