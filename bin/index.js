#!/usr/bin/env node

/* eslint-disable no-console */

const cac = require('cac');

const config = require('./lib/config');
const api = require('./lib/api');
const settings = require('./lib/api/settings');
const fields = require('./lib/api/fields');
const layout = require('./lib/api/layout');
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

cli.command('clone', 'clone', async () => {
  Promise.resolve()
    // .then(() => api.create())
    // .then(res => api.deploy(res.app, res.revision))
    .then(() => settings.get())
    .then(res => settings.put(25, res))
    .then(() => fields.get())
    .then(res => fields.post(25, res))
    .then(() => layout.get())
    .then(res => layout.put(25, res))
    .then(() => api.deploy(25, -1))
    .catch((err) => {
      console.error(err);
    });
});

cli.command('delete', 'delete', async () => {
  Promise.resolve()
    .then(() => fields.get())
    .then(res => fields.delete(25, res))
    // .then(() => api.deploy(25, -1))
    .catch((err) => {
      console.error(err);
    });
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
