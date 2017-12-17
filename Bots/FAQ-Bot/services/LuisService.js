/**
 * This module gets the intent to given query from our LUIS application
 *
 * @author Simon Schwarz
 * @module FAQ-Bot/services/LuisService
 */
const rp = require('request-promise');
const {
  config,
} = require('dotenv');

config();
const subscriptionKey = '238a32183c054721ad57101b5baec64f';

exports.getIntent = async (query) => {
  const endpointUrl = JSON.parse(process.env.NODE_ENV_ENDPOINT);
  const myUri = `${endpointUrl}?q=${query}&verbose=true`;
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
