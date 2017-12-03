const FileService = require('../../../Bot-Runtime/services/FileService');

exports.compareIntent = async (recognizedIntent) => {
  const data = await FileService.readConfigDataFromFile('./config.json');
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
