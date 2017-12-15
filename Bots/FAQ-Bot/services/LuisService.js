
const rp = require('request-promise');

const subscriptionKey = 'd47c8171395f412db4c93c39f6404d3b';

exports.getIntent = async (query) => {
  const endpointUrl = JSON.parse(process.env.NODE_ENV_ENDPOINT);
  const myUri = `${endpointUrl}?q=${query}&verbose=true`;
  console.log(myUri);
  const callEndpointApi = async (options) => {
    try {
      const response = await rp.get(options);
      return response;
    } catch (err) {
      throw err;
    }
  };

  const createEndpointPromise = callEndpointApi({
    uri: myUri,
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': subscriptionKey,
    },
  });
  const result = await createEndpointPromise;
  return JSON.parse(result);
};

// getIntent('Was kostet mein Fisch?');
