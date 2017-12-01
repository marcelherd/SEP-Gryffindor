/**
 * This module is responsible feeding the input to LUIS
 * and training it.
 *
 * @module services/
 */
const fs = require('fs');
const { promisify } = require('util');
const createApp = require('./Luis/createApp');
const postIntents = require('./Luis/postIntents');
const postUtterances = require('./Luis/addUtterances');

const readFile = promisify(fs.readFile);

const subscriptionKey = 'd47c8171395f412db4c93c39f6404d3b';
const versionId = '0.1';
const postAppUri = 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/';
let appId;

const readDataFromFile = async () => {
  try {
    const data = await readFile('../../Bots/FAQ-Bot/config.json', { encoding: 'utf8' });
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};
const addUtterances = async (intent) => {
  intent.utterances.forEach((utterance) => {
    const configUtterances = {
      LUIS_subscriptionKey: subscriptionKey,
      LUIS_appId: appId,
      LUIS_versionId: versionId,
      utterance,
      uri: 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples'.replace('{appId}', appId).replace('{versionId}', versionId),
    };
    postUtterances(configUtterances);
  });
};

const addIntents = async (intents) => {
  const intentConfig = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_appId: appId,
    LUIS_versionId: versionId,
    intentList: intents,
    uri: `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/versions/${versionId}/intents`,
  };
  await postIntents(intentConfig);
  intents.forEach((intent) => {
    addUtterances(intent);
  });
};

const addNewApp = async () => {
  let data;
  try {
    data = await readDataFromFile();
    console.log('Reading was succesfull');
  } catch (err) {
    console.log(err);
  }
  const appConfig = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_versionId: versionId,
    appName: `${data.name} application`,
    culture: 'en-us',
    uri: postAppUri,
  };
  appId = await createApp(appConfig);
  addIntents(data.intents);
};

addNewApp();


// const readIntentsFromFile = async () => {
//   const data = await readDataFromFile();
//   return data.intents;
// };
// // exports.feedIntents = async () => {
//   const intents = await readIntentsFromFile();
//   intents.array.forEach((element) => {
//     element.name;
//   });
// };
