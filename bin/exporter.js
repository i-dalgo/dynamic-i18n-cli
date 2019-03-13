'use-strict';
const { readFile, writeFile, getFilesName } = require('./utils');
const mergeByKey = require('array-merge-by-key');
const flatten = require('flat');

module.exports = (localesPath = './src/lang/') => {
  const locales = getFilesName(localesPath);
  const models = {};
  const flatModels = [];

  if (!locales) return console.error('No locale files found !')

  locales.forEach(locale => {
    models[locale] = [];
    let rows = JSON.parse(readFile(`${localesPath}${locale}.json`));
    rows = flatten(rows);
    Object.keys(rows).forEach(key => {
      models[locale].push({
        key,
        [locale]: rows[key]
      });
    });
  });

  Object.keys(models).forEach(key => { flatModels.push(models[key]) });

  const result = mergeByKey('key', ...flatModels);
  writeFile(`./locales.json`, JSON.stringify(result));
}
