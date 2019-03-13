#!/usr/bin/env node
const program = require('commander');
const importer = require('./bin/importer');
const exporter = require('./bin/exporter');

program
  .version('1.0.0', '-v, --version')
  .description('Locale files manager');

program
  .command('import <apiUrl> [localesPath]')
  .alias('i')
  .description('Import locales from an external API Endpoint')
  .action((apiUrl, localesPath) => {
    importer(apiUrl, localesPath);
  });

program
  .command('export [localesPath]')
  .alias('e')
  .description('Import locales to Json')
  .action(localesPath => exporter(localesPath));

program.parse(process.argv);