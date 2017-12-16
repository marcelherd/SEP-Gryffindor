/**
 * This module is responsible feeding the input to LUIS
 * and training it.
 *
 * @module services/LuisService
 */
const {
  promisify,
} = require('util');
const createApp = require('./Luis/createApp');
const postIntents = require('./Luis/postIntents');
const Utterances = require('./Luis/addUtterances');
const Training = require('./Luis/train');
const publish = require('./Luis/publishApp');
const fs = require('fs');
const waitUntil = require('async-wait-until');


const readAFile = promisify(fs.readFile);


const subscriptionKey = 'd47c8171395f412db4c93c39f6404d3b';
const versionId = '0.1';
const postAppUri = 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/';
let appId;

/**
 * @param path the path to the file that is supposed to be parsed
 * @returns {Promise} Content of the file parsed to JSON
 */
const readMyFile = async path => JSON.parse(await readAFile(path, { encoding: 'utf-8' }));

/**
 * publishes your Microsoft LUIS App
 * @returns {Promise} most importantly the url under which the app is published
 * For more detailed information look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3b
 */
const publishMyApp = async () => {
  const configAppPublish = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_appId: appId,
    LUIS_versionId: versionId,
    LUIS_region: 'westus',
    uri: `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/publish`,
    method: 'POST',
  };
  try {
    const results = await publish.publishApp(configAppPublish);
    return results;
  } catch (err) {
    throw err;
  }
};

/**
 * Polls to Microsoft API until its completely trained and subsequently publishes the app
 * @returns {Promise} Most importantly the url that the LUIS app is published under
 */
const getTrainingStatus = async () => {
  const trainingStatus = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_appId: appId,
    LUIS_versionId: versionId,
    uri: `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/versions/${versionId}/train`,
    method: 'GET',
  };
  let results;
  try {
    let result = false;
    do {
      results = await Training.train(trainingStatus);
      result = await waitUntil(async () => {
        const trainingTotal = results.response.length;
        const successfullyTrained = results.response.filter(current => current.details.statusId === 0);
        return successfullyTrained.length === trainingTotal;
      }, 600);
    } while (result === false);
    const answer = await publishMyApp();
    const {
      response,
    } = answer;
    return response;
  } catch (err) {
    throw err;
  }
};

/**
 * Trains the Microsoft LUIS App
 * @returns {Promise} The Training status telling you which intents have been trained and which have not
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c45
 */
const trainMyApp = async () => {
  const configTrain = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_appId: appId,
    LUIS_versionId: versionId,
    uri: `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/versions/${versionId}/train`,
    method: 'POST',
  };
  try {
    const response = await Training.train(configTrain);
    return response;
  } catch (err) {
    throw err;
  }
};

/**
 * Adds all utterances to your Microsoft LUIS App
 * @returns {Promise} The ID of the created example
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c08
 */
const addUtterances = async (intentArray) => {
  const configUtterances = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_appId: appId,
    LUIS_versionId: versionId,
    utterance: intentArray,
    uri: `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/versions/${versionId}/examples`,
  };
  try {
    const results = await Utterances.addUtterance(configUtterances);
    return results;
  } catch (err) {
    throw err;
  }
};

/**
 * Adds all intents to your Microsoft LUIS App
 * @returns {Promise} The ID of the created model
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0c
 */
const addIntents = async (intents) => {
  const intentConfig = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_appId: appId,
    LUIS_versionId: versionId,
    intentList: intents,
    uri: `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/versions/${versionId}/intents`,
  };
  try {
    await postIntents(intentConfig);
    let intentArray = [];
    intents.forEach((intent) => {
      intent.utterances.splice(-1, 1);
      intentArray = intentArray.concat(intent.utterances);
    });
    return intentArray;
  } catch (err) {
    throw err;
  }
};
/**
 * Initially creates the new Microsoft Luis App
 * @param path the path to the JSON file with the apps configuration coming from the frontend
 * @returns {string} the App's id
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f
 */

const addNewApp = async (path) => {
  let data;
  try {
    data = await readMyFile(path);

    const appConfig = {
      LUIS_subscriptionKey: subscriptionKey,
      LUIS_versionId: versionId,
      appName: `${data._id}${data.updatedAt}`,
      culture: 'en-us',
      uri: postAppUri,
    };
    appId = await createApp(appConfig);
    return data.intents;
  } catch (err) {
    throw err;
  }
};

/**
 * Goes through all steps of creating a new LUIS App subsequently
 * @param path the path to the JSON file with the apps configuration coming from the frontend
 * @returns {Promise} most importantly the Url to the LUIS endpoint
 */

exports.createApp = async (path) => {
  try {
    const intents = await addNewApp(path);
    const intentArray = await addIntents(intents);
    await addUtterances(intentArray);
    await trainMyApp();
    const results = await getTrainingStatus();
    return results;
  } catch (err) {
    throw err;
  }
};
