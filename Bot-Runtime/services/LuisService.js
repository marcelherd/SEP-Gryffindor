/**
 * This module is responsible feeding the input to LUIS
 * and training it.
 *
 * @module services/LuisService
 */
const {
  promisify,
} = require('util');
const fs = require('fs');


const waitUntil = require('async-wait-until');
const {
  config,
} = require('dotenv');

const createApp = require('./Luis/createApp');
const postIntents = require('./Luis/postIntents');
const Utterances = require('./Luis/addUtterances');
const Training = require('./Luis/train');
const publish = require('./Luis/publishApp');


const readAFile = promisify(fs.readFile);


config();


const subscriptionKey = process.env.SUBSCRIPTION_KEY;
const versionId = '0.1';
const postAppUri = 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/';
let appId;

/**
 * @param {string} path the path to the file that is supposed to be parsed
 * @returns {Promise} Content of the file parsed to JSON
 */
const readMyFile = async path => JSON.parse(await readAFile(path, { encoding: 'utf-8' }));

/**
 * publishes your Microsoft LUIS App
 * For more detailed information look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3b
 * @returns {string} the url under which the app is published
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
    const { endpointUrl } = await publish.publishApp(configAppPublish);
    console.log(endpointUrl);
    return endpointUrl;
  } catch (err) {
    throw err;
  }
};

/**
 * Polls to Microsoft API until its completely trained and subsequently publishes the app
 * @returns {string} the url under which the LUIS app is published
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
    return publishMyApp();
  } catch (err) {
    throw err;
  }
};

/**
 * Trains the Microsoft LUIS App
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c45
 * @returns {Promise} indicates the initial training status
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
    return Training.train(configTrain);
  } catch (err) {
    throw err;
  }
};

/**
 * Adds all utterances to your Microsoft LUIS App
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c08
 * @returns {Array} contains a string array determining the IDs of the added labels.
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
    return Utterances.addUtterance(configUtterances);
  } catch (err) {
    throw err;
  }
};

/**
 * Adds all intents to your Microsoft LUIS App
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0c
 * @returns {Array} contains all the utterances that need to be posted to LUIS
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
    let utteranceArray = [];
    intents.forEach((intent) => {
      intent.utterances.splice(-1, 1);
      utteranceArray = utteranceArray.concat(intent.utterances);
    });
    return utteranceArray;
  } catch (err) {
    throw err;
  }
};
/**
 * Initially creates the new Microsoft Luis App
 * For more detailed info look here: https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f
 * @param {string} path the path to the JSON file with the apps configuration coming from the frontend
 * @returns {array} All intents for the app
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
    // sets app's id here
    appId = await createApp(appConfig);
    return data.intents;
  } catch (err) {
    throw err;
  }
};

/**
 * Goes through all steps of creating a new LUIS App subsequently
 * @param {string} path the path to the JSON file with the apps configuration coming from the frontend
 * @returns {string} the url to the LUIS endpoint
 */

exports.createApp = async (path) => {
  try {
    const intents = await addNewApp(path);
    const intentArray = await addIntents(intents);
    await addUtterances(intentArray);
    await trainMyApp();
    return getTrainingStatus();
  } catch (err) {
    throw err;
  }
};
