const rp = require('request-promise');


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
