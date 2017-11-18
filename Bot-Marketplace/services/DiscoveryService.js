/**
 * TODO: documentation
 *
 * @module services/DiscoveryService
 */

const { lstatSync, readdirSync, readFileSync } = require('fs');
const { join } = require('path');

const BASE_PATH = '../Bots/';

/**
 * Checks whether the given source is a directory.
 *
 * @param {string} source - Path
 * @returns {boolean} True if the given source is a directory
 */
const isDirectory = source => lstatSync(source).isDirectory();

/**
 * Returns the paths for all directories inside the given source.
 *
 * @param {string} source - Path
 * @returns {string[]} Paths for all directories inside the given source
 */
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory);

/**
 * TODO: documentation
 *
 * @returns {Object[]} Metadata for all avaiable bot templates
 */
exports.getTemplates = function () {
  const templates = [];

  const botDirectories = getDirectories(BASE_PATH);

  botDirectories.forEach((directory) => {
    try {
      const path = join(directory, 'package.json');
      const contents = readFileSync(path, 'utf8');
      const object = JSON.parse(contents);

      templates.push(object.__bottertoast_bot_template__);
    } catch (err) {
      if (err instanceof SyntaxError) {
        console.log(`Skipping ${directory}: no template metadata configured.`);
      } else {
        console.log(`Skipping ${directory}: no package.json found.`);
      }
    }
  });

  return templates;
};
