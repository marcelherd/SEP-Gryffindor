/**
 * This module is responsible feeding the input to LUIS
 * and training it.
 *
 * @module services/
 */
const {
  promisify,
} = require('util');
const createApp = require('./Luis/createApp');
const postIntents = require('./Luis/postIntents');
const Utterances = require('./Luis/addUtterances');
const Training = require('./Luis/train');
const publish = require('./Luis/publishApp');
const deleteApp = require('./Luis/deleteApp');
const {
  setInterval,
} = require('timers');
const fileService = require('./FileService');


const subscriptionKey = 'd47c8171395f412db4c93c39f6404d3b';
const versionId = '0.1';
const postAppUri = 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/';
let appId;

const publishMyApp = async() => {
  const configAppPublish = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_appId: appId,
    LUIS_versionId: versionId,
    LUIS_region: 'westus',
    uri: `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/publish`,
    method: 'POST',
  };
  return publish.publishApp(configAppPublish);
};
const getTrainingStatus = async() => {
  const trainingStatus = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_appId: appId,
    LUIS_versionId: versionId,
    uri: `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/versions/${versionId}/train`,
    method: 'GET',
  };
  let results;
  const interval = setInterval(async() => {
    let success = true;
    results = await Training.train(trainingStatus);
    for (let i = 0; i < results.response.length && success; i++) {
      console.log('My results');
      success = success && results.response[i].details.statusId === 0;
    }
    if (success) {
      console.log('Cleared Interval');
      clearInterval(interval);
      const answer = await publishMyApp();
      const {
        response,
      } = answer;
      console.log(response);
      await fileService.writeToFile(response, './endpoint.json');
    }
  }, 500);
};
const trainMyApp = async() => {
  console.log('the Id:');
  console.log(appId);
  const configTrain = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_appId: appId,
    LUIS_versionId: versionId,
    uri: `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/versions/${versionId}/train`,
    method: 'POST',
  };
  await Training.train(configTrain);
  getTrainingStatus();
};
const addUtterances = async(intentArray) => {
  const configUtterances = {
    LUIS_subscriptionKey: subscriptionKey,
    LUIS_appId: appId,
    LUIS_versionId: versionId,
    utterance: intentArray,
    uri: `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${appId}/versions/${versionId}/examples`,
  };
  await Utterances.addUtterance(configUtterances);
  trainMyApp();
};

const addIntents = async(intents) => {
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
    // intent.uterrances = intent.utterances.splice(intent.utterances.length - 1, 1);
    intentArray = intentArray.concat(intent.utterances);
  });
  addUtterances(intentArray);
};
const deleteOldApp = async (deleteAppId) => {
  const deleteThisApp = {
    LUIS_subscriptionKey: subscriptionKey,
    uri: `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${deleteAppId}`,
  };
  await deleteApp(deleteThisApp);
};

exports.addNewApp = async () => {
  let data;
  try {
    data = await fileService.readConfigDataFromFile('../Bots/FAQ-Bot/config.json');
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
  try {
    let apps = await fileService.getAppIds();
    const getId = async () => {
      for (let i = 0; i < apps.length; i++) {
        if (apps[i].n === appConfig.appName) {
          const { id } = apps[i];
          apps.splice(i, 1);
          return id;
        }
      }
    };
    const deleteId = await getId();
    await deleteOldApp(deleteId);
    console.log(apps);
    await fileService.writeAppIdsAfterDeletion(apps, './apps.json');
  } catch (err) {
    console.log(err);
    console.log('No App created yet, so just create First one');
  }
  appId = await createApp(appConfig);
  await fileService.writeAppIds(appId, appConfig.appName);
  addIntents(data.intents);
};
