'use-strict';
const unflatten = require('flat').unflatten;
const axios = require('axios');
const writeFile = require('./utils').writeFile;

module.exports = async (apiUrl, localesPath = './src/lang/') => {
  let { data } = await axios.get(apiUrl);
  const bannedKeys = ['id', 'key', 'created_at', 'updated_at']; // useless-keys
  const languages = Object.keys(data[0]).filter(el => !bannedKeys.includes(el));
  if (!languages) return console.error('No languages found')
  languages.forEach(lang => {
    let file = {};
    data.forEach(row => {
      file[row.key] = row[lang];
    });
    file = unflatten(file);
    writeFile(`${localesPath}${lang}.json`, JSON.stringify(file));
  });
}
