/**
 * This module trains the LUIS App
 * @author Simon Schwarz
 * @module services/Luis/train
 */

const utterances = require('./addUtterances');

/**
 * trains the LUIS app
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c45
 *
 * @param {Object} config represent the config needed for the options for the post request including the app's name
 * @method sendUtteranceToApi is used start the training
 * @returns {Promise} indicates the initial training status
 */
exports.train = async (config) => {
  let trainingStatus;
  try {
    const trainingPromise = utterances.sendUtteranceToApi({
      uri: config.uri,
      method: config.method,
      headers: {
        'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey,
      },
      json: true,
      body: null,
    });
    trainingStatus = await trainingPromise;
  } catch (err) {
    throw err;
  }
  return trainingStatus;
};
