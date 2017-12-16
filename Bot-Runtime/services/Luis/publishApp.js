/**
 * This module publishes the Microsoft LUIS app
 *
 * @module services/Luis/publishApp
 */
const rp = require('request-promise');

/**
 * posts the app with its configuration to Microsoft's API and awaits its results
 * @param config represent the config needed for the options for the post request
 * @returns {Promise} most importantly the uri under which the app is published
 * For more detailed information look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3b
 */
exports.publishApp = async (config) => {
  const payload = {
    versionId: config.LUIS_versionId,
    isStaging: 'false',
    region: config.LUIS_region,
  };
  const options = {
    uri: config.uri,
    method: config.method,
    headers: {
      'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey,
    },
    json: true,
    body: payload,
  };
  try {
    const response = await rp.post(options);
    console.log('publish successful');
    return { request: options.body, response };
  } catch (err) {
    throw err;
  }
};
