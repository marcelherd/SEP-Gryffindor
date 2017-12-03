const fs = require('fs');

const {
  promisify,
} = require('util');

const readFile = promisify(fs.readFile);

exports.readConfigDataFromFile = async (path) => {
  try {
    const data = await readFile(path, {
      encoding: 'utf8',
    });
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};

exports.writeEndpointToFile = async(endpointData) => {
  fs.writeFile('../endpoint.json', JSON.stringify(endpointData), (err) => {
    if (err) {
      console.log(err);
    }
  });

};
