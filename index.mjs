#!/usr/bin/env node
import program from 'commander';
import importer from './bin/importer.mjs';
import exporter from './bin/exporter.mjs';

// Replacing import from package.json not stable
const version = '2.0.0'

program
  .version(pkg.version, '-v, --version')
  .description('Locale files manager');

program
  .command('import <apiUrl> [localesPath]')
  .alias('i')
  .description('Import locales from an external API Endpoint')
  .action(importer);

program
  .command('export [localesPath]')
  .alias('e')
  .description('Import locales to Json')
  .action(exporter);

program.parse(process.argv);
