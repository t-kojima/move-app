#!/usr/bin/env node

/* eslint-disable no-console */

const cac = require('cac');
const util = require('util');

const config = require('./lib/config');
const api = require('./lib/api');
const settings = require('./lib/api/settings');
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
    .then(() => api.deploy(25, -1))
    // .then(res => console.info(res))
    .catch((err) => {
      console.error(err);
    });
  //   // console.log(util.inspect(
  //   //   `
  //   // [Request]
  //   // ${err.config}
  //   // [Response]
  //   //   Status : ${err.response.status}
  //   //   Message: ${err.response.statusText}
  //   //   Data   : ${err.response.data}
  //   // `,
  //   //   false,
  //   //   null,
  //   // ));
  //   console.error('[Request]');
  //   console.error(err.config.headers);
  //   console.error('[Response]');
  //   console.error(` Status : ${err.response.status}`);
  //   console.error(` Message: ${err.response.statusText}`);
  //   console.error(` Data   : ${err.response.data}`);
  // });
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
