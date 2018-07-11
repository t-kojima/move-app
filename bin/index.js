#!/usr/bin/env node

/* eslint-disable no-console */

const cac = require('cac');
const config = require('./lib/config');
const api = require('./lib/api');
// const template = require('./lib/template')

const cli = cac();

cli.command('*', 'Display help <default>', () => {
  cli.showHelp();
});

cli.command('init', 'Create an authentication template.', () => {
  config.init().catch((err) => {
    console.error(err);
  });
});

cli.command('create', 'create', async () => {
  Promise.resolve()
    .then(() => api.create())
    .then(res => api.deploy(JSON.parse(res)))
    .catch(err => console.info(err));
});

const fetchCommand = cli.command(
  'fetch',
  'Fetch are app schema files with kintone REST API.',
  async (input, flags) => {
    await api.fetch().catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    });
    if (!flags.schema) {
      await template.create().catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
    }
  },
);

fetchCommand.option('schema', {
  desc: 'fetch schema only.',
  alias: 's',
});

cli.parse();
