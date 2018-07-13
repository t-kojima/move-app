#!/usr/bin/env node

/* eslint-disable no-console */

const cac = require('cac');

const config = require('./lib/config');
const { create, deploy } = require('./lib/api');
const settings = require('./lib/api/settings');
const fields = require('./lib/api/fields');
const layout = require('./lib/api/layout');
const views = require('./lib/api/views');
const acl = require('./lib/api/acl');
const status = require('./lib/api/status');
const customize = require('./lib/api/customize');
// const template = require('./lib/template')

const { green, red } = require('./lib/colors');

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
  try {
    // const { from, to } = await create();
    const from = 2;
    const to = 25;
    await settings.get(from).then(res => settings.put(to, res));
    await fields.get(from).then(res => fields.post(to, res));
    await layout.get(from).then(res => layout.put(to, res));
    await views.get(from).then(res => views.put(to, res));

    await acl.app.get(2).then(res => acl.app.put(25, res));
    await acl.record.get(2).then(res => acl.record.put(25, res));
    await acl.field.get(2).then(res => acl.field.put(25, res));
    await status.get(2).then(res => status.put(25, res));

    await deploy(to, -1);
    console.info(green('\nApp Cloning Successfully.'));
  } catch (e) {
    console.error(red(`Error: ${e.response.statusText} [${e.response.status}]`));
    console.error(e.response.data);
  }
});

cli.command('test', 'test', async () => {
  await customize.get(2).then(res => customize.put(25, res));
});

cli.command('delete', 'delete', async () => {
  try {
    await status.delete(25);
    await fields.get(2).then(res => fields.delete(25, res));
    console.info(green('\nApp Deleted Successfully.'));
  } catch (e) {
    console.error(red(`Error: ${e.response.statusText} [${e.response.status}]`));
    console.error(e.response.data);
  }
});

// const fetchCommand = cli.command(
//   'fetch',
//   'Fetch are app schema files with kintone REST API.',
//   async (input, flags) => {
//     await api.fetch().catch((err) => {
//       // eslint-disable-next-line no-console
//       console.error(err);
//     });
//     if (!flags.schema) {
//       await template.create().catch((err) => {
//         // eslint-disable-next-line no-console
//         console.error(err);
//       });
//     }
//   },
// );

// fetchCommand.option('schema', {
//   desc: 'fetch schema only.',
//   alias: 's',
// });

cli.parse();
