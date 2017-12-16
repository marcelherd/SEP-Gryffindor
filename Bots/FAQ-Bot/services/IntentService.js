
exports.compareIntent = async (recognizedIntent) => {
  try {
    const data = JSON.parse(process.env.NODE_ENV_CONFIG);
    for (let i = 0; i < data.intents.length; i++) {
      const intent = data.intents[i];
      if (intent.name === recognizedIntent) {
        return intent.answer;
      }
    }
  } catch (err) {
    return err;
  }
};
