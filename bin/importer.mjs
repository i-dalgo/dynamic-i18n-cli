'use strict';

import axios from 'axios';
import https from 'https';
import shell from 'shelljs';
import { unflatten } from 'flat';
import { writeFile } from './utils.mjs';

const DISABLED_KEYS = ['id', 'key', 'created_at', 'updated_at', 'published_at']; // useless-keys


export default async function importLocales(apiUrl, localesPath = './src/lang/') {
  const start = new Date();
  let status = true;
  let locales = [];

  shell.echo(`
  ✨  Importing locales from "${apiUrl}"
  `);
  const agent = new https.Agent({ rejectUnauthorized: false });
  try {
    const { data } = await axios.get(apiUrl, { httpsAgent: agent });
    locales = Object.keys(data[0]).filter(el => !DISABLED_KEYS.includes(el));
    if (!locales.length) {
      shell.echo('  ❌  No locales found');
      return;
    }

    locales.forEach(locale => {
      let file = {};
      data.forEach(row => {
        file[row.key] = row[locale];
      });
      file = unflatten(file);
      const path = `${localesPath}${locale}.json`;
      const fileStatus = writeFile(path, JSON.stringify(file));
      if (!fileStatus) {
        status = false;
        shell.echo(`  ❌  Can't create ${path}`);
      } else {
        shell.echo(`  ✍  Created "${path}" with ${Object.keys(file).length} keys`);
      }
    });
  } catch (error) {
    shell.echo(`  ❌  Error fetching data: ${error.message}`);
    status = false;
  }

  const end = new Date() - start;

  // Something went wrong => exit with an error
  if (!status) process.exit(1);

  // Everything works
  shell.echo(`
  ✨  Done! ${locales.length} file(s) created in ${end}ms!
  `);
  process.exit();
}
