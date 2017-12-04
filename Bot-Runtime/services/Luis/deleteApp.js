
const rp = require('request-promise');


const deleteApp = async (config) => {
  try {
    // delete the App
    const callDeleteApp = async (options) => {
      try {
        const response = await rp.del(options);
        console.log(response);
        return response;
      } catch (err) {
        throw err;
      }
    };
    const createAppPromise = callDeleteApp({
      uri: config.uri,
      headers: {
        'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey,
      },
    });

    const response = await createAppPromise;

    return response;
  } catch (err) {
    console.log(`Error deleting app:  ${err.message} `);
    return err;
  }
};


module.exports = deleteApp;
