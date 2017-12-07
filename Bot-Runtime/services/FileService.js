const fs = require('fs');
const getPath = require('path');

const {
  promisify,
} = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

exports.readConfigDataFromFile = async (folder, filename) => {
  try {
    const data = await readFile(getPath.resolve(folder, filename), {
      encoding: 'utf8',
    });
    return JSON.parse(data);
  } catch (err) {
    console.log('errrrr');
    throw err;
  }
};

exports.writeToFile = async (data, folder, filename) => fs.writeFile(getPath.resolve(folder, filename), JSON.stringify(data), (err) => {
  if (err) {
    console.log(err);
  }
});
exports.writeAppIdsAfterDeletion = async (apps, folder, filename) => {
  exports.writeToFile(apps, folder, filename);
};

exports.writeAppIds = async (appId, name) => {
  try {
    const apps = await this.readConfigDataFromFile('services/Luis', 'apps.json');
    apps.push({
      n: name,
      id: appId,
    });
    fs.writeFile('./services/Luis/apps.json', JSON.stringify(apps), (err) => {
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
    await writeFile('./services/Luis/apps.json', JSON.stringify(apps), (error) => {
      if (error) {
        return error;
      }
      return 'success';
    });
  }
};

exports.getAppIds = async () => exports.readConfigDataFromFile('services/Luis', 'apps.json');
