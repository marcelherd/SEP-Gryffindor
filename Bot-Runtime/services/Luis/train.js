/**
 * This module trains the LUIS App
 *
 * @module services/Luis/train
 */

const utterances = require('./addUtterances');

/**
 * posts the app with its configuration to Microsoft's API and awaits its results
 * @param config represent the config needed for the options for the post request including the app's name
 * @method sendUtteranceToApi is used to check for training status
 * @returns {Promise} the Training status telling you which utterances have been trained and which have not
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c45
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
