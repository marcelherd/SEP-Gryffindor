
exports.compareIntent = async (recognizedIntent) => {
  const data = JSON.parse(process.env.NODE_ENV);
  for (let i = 0; i < data.intents.length; i++) {
    const intent = data.intents[i];
    if (intent.name === recognizedIntent) {
      console.log('hello');
      console.log(intent.answer);
      return intent.answer;
    }
  }
  return null;
};
