/**
 * This module is responsible feeding the input to LUIS
 * and training it.
 *
 * @module services/
 */
const fs = require('fs');
const {
  promisify,
} = require('util');
const createApp = require('./Luis/createApp');
const postIntents = require('./Luis/postIntents');
const Utterances = require('./Luis/addUtterances');
const Training = require('./Luis/train');

const readFile = promisify(fs.readFile);

const subscriptionKey = 'd47c8171395f412db4c93c39f6404d3b';
const versionId = '0.1';
const postAppUri = 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/';
let appId;

const timeout = (ms = 3000) => new Promise(resolve => setTimeout(resolve, ms));



const readDataFromFile = async () => {
  try {
    const data = await readFile('../Bots/FAQ-Bot/config.json', {
      encoding: 'utf8',
    });
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};
const getTrainingStatus = async () => {
  const trainingStatus = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_appId: appId,
    LUIS_versionId: versionId,
    uri: 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/train'.replace('{appId}', appId).replace('{versionId}', versionId),
    method: 'GET',
  };
  await Training.train(trainingStatus);
};
const trainMyApp = async () => {
  const configTrain = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_appId: appId,
    LUIS_versionId: versionId,
    uri: 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/train'.replace('{appId}', appId).replace('{versionId}', versionId),
    method: 'POST', // POST to request training, GET to get training status
  };
  await Training.train(configTrain);
  await timeout();
  getTrainingStatus();
};
const addUtterances = async (intentArray) => {
  const configUtterances = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_appId: appId,
    LUIS_versionId: versionId,
    utterance: intentArray,
    uri: 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples'.replace('{appId}', appId).replace('{versionId}', versionId),
  };
  await Utterances.addUtterance(configUtterances);
  trainMyApp();
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
  let intentArray = [];
  intents.forEach((intent) => {
    intentArray = intentArray.concat(intent.utterances);
  });
  addUtterances(intentArray);
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

module.exports = trainMyApp;

