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
const fs = require('fs');
const waitUntil = require('async-wait-until');

const readAFile = promisify(fs.readFile);


const subscriptionKey = 'd47c8171395f412db4c93c39f6404d3b';
const versionId = '0.1';
const postAppUri = 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/';
let appId;

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
    console.log('My results: ');
    console.log(results);
    return results;
  } catch (err) {
    throw err;
  }
};
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
      }, 600)
    } while(result === false);
    console.log(result);
    const answer = await publishMyApp();
    const {
      response,
    } = answer;
    await fileService.writeToFile(response, 'services/Luis', 'endpoint.json');
    return response;
  } catch (err) {
    throw err;
  }
};


const trainMyApp = async () => {
  console.log('the Id:');
  console.log(appId);
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


const deleteOldApp = async (deleteAppId) => {
  const deleteThisApp = {
    LUIS_subscriptionKey: subscriptionKey,
    uri: `https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/${deleteAppId}`,
  };
  try {
    await deleteApp(deleteThisApp);
  } catch (err) {
    throw err;
  }
};
const readMyFile = async path => JSON.parse(await readAFile(path, { encoding: 'utf-8' }));


const addNewApp = async (path) => {
  let data;
  try {
    data = await readMyFile(path);
    console.log(data);
    console.log('Reading was succesfull');
    const appConfig = {
      LUIS_subscriptionKey: subscriptionKey,
      LUIS_versionId: versionId,
      appName: `${data._id}${data.updatedAt}`,
      culture: 'en-us',
      uri: postAppUri,
    };
    console.log(appConfig);
    try {
      const apps = await fileService.getAppIds();
      const getId = async () => {
        for (let i = 0; i < apps.length; i++) {
          if (apps[i].n === appConfig.appName) {
            const {
              id,
            } = apps[i];
            apps.splice(i, 1);
            return id;
          }
        }
      };
      const deleteId = await getId();
      await deleteOldApp(deleteId);
      await fileService.writeAppIdsAfterDeletion(apps, 'services/Luis', '/apps.json');
    } catch (err) {
      console.log('No App created yet. Just procced');
    }
    appId = await createApp(appConfig);
    await fileService.writeAppIds(appId, appConfig.appName);
    return data.intents;
  } catch (err) {
    throw err;
  }
};

exports.createApp = async (path) => {
  try {
    const intents = await addNewApp(path);
    const intentArray = await addIntents(intents);
    await addUtterances(intentArray);
    await trainMyApp();
    const results = await getTrainingStatus();
    // const results = await publishMyApp();
    console.log('here I return thou my promise');
    return results;
  } catch (err) {
    throw err;
  }
};
