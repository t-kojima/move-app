/* eslint-disable no-console, no-param-reassign */

const { get, put } = require('../api');
const { green } = require('../colors');

exports.get = async app => {
  const response = await get('/app/settings.json', { app });
  return response;
};

exports.put = async (app, data) => {
  data.app = app;
  data.revision = -1;
  await put('/preview/app/settings.json', data);
  console.info(`${green('Copy Settings')} ${JSON.stringify(data, null, '  ')}`);
};
