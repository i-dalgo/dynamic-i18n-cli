'use strict';
const shell = require('shelljs');
const unflatten = require('flat').unflatten;
const axios = require('axios');
const writeFile = require('./utils').writeFile;
const https = require('https');

module.exports = async (apiUrl, localesPath = './src/lang/') => {
  const start = new Date();
  let status = true;
  shell.echo(`
  ✨  Importing locales from "${apiUrl}"
  `);
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  let { data } = await axios.get(apiUrl, { httpsAgent: agent });
  const bannedKeys = ['id', 'key', 'created_at', 'updated_at', 'published_at']; // useless-keys
  const languages = Object.keys(data[0]).filter(el => !bannedKeys.includes(el));
  if (!languages) return console.error('No languages found')
  languages.forEach(lang => {
    let file = {};
    data.forEach(row => {
      file[row.key] = row[lang];
    });
    file = unflatten(file);
    const path = `${localesPath}${lang}.json`;
    const fileStatus = writeFile(path, JSON.stringify(file));
    if (!fileStatus) {
      status = false
      shell.echo(`  ❌  Can't create ${path}`);
    } else {
      shell.echo(`  ✍  Created ${path}`);
    }
  });

  const end = new Date() - start;

  // Something wrong happen => returning an error
  if (!status) process.exit(1);

  // Everything works
  shell.echo(`
  ✨  Done ! ${languages.length} file(s) created in ${end}ms !
  `);
  process.exit();
}
