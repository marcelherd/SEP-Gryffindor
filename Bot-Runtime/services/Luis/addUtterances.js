const { setInterval } = require('timers');

// node 7.x
// uses async/await - promises

const rp = require('request-promise');

exports.sendUtteranceToApi = async (options) => {
  try {
    let response;
    if (options.method === 'POST') {
      response = await rp.post(options);
    } else if (options.method === 'GET') {
      response = await rp.get(options);
    }

    return { request: options.body, response };
  } catch (err) {
    throw err;
  }
};

exports.addUtterance = async (config) => {
  try {
    // Add an utterance
    const utterancePromise = this.sendUtteranceToApi({
      uri: config.uri,
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey,
      },
      json: true,
      body: config.utterance,
    });
    let results;
    const interval = setInterval(async () => {
      let success = true;
      results = await utterancePromise;
      for (let i = 0; i < results.length && success; i++) {
        success = success && results[i].details.statusId === 0;
      }
      if (success) {
        clearInterval(interval);
      }
    }, 500);


    console.log(results);

    console.log('Add utterance done');
  } catch (err) {
    console.log(`Error adding utterance:  ${err.message} `);
    // throw err;
  }
};
