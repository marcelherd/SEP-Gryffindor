const fs = require('fs');

const {
  promisify,
} = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

exports.readConfigDataFromFile = async (path) => {
  try {
    const data = await readFile(path, {
      encoding: 'utf8',
    });
    return JSON.parse(data);
  } catch (err) {
    console.log('errrrr');
    throw err;
  }
};

exports.writeToFile = async (data, path) => fs.writeFile(path, JSON.stringify(data), (err) => {
  if (err) {
    console.log(err);
  }
});
exports.writeAppIdsAfterDeletion = async (apps, path) => {
  exports.writeToFile(apps, path);
};

exports.writeAppIds = async (appId, name) => {
  try {
    const apps = await this.readConfigDataFromFile('./Luis/apps.json');
    apps.push({
      n: name,
      id: appId,
    });
    fs.writeFile('./Luis/apps.json', JSON.stringify(apps), (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    const apps = [];
    apps.push({
      n: name,
      id: appId,
    });
    await writeFile('./Luis/apps.json', JSON.stringify(apps), (error) => {
      if (error) {
        return error;
      }
      return 'success';
    });
  }
};

exports.getAppIds = async () => exports.readConfigDataFromFile('./Luis/apps.json');

