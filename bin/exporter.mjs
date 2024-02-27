'use strict';

import { flatten } from 'flat';
import mergeByKey from 'array-merge-by-key';
import { readFile, writeFile, getFilesName } from './utils.mjs';

export default function generateLocales(localesPath = './src/lang/') {
  const locales = getFilesName(localesPath);
  const models = {};
  const flatModels = [];

  if (!locales) {
    console.error('No locale files found!');
    return;
  }

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

  Object.keys(models).forEach(key => {
    flatModels.push(models[key]);
  });

  const result = mergeByKey('key', ...flatModels);
  writeFile('./locales.json', JSON.stringify(result));
}
