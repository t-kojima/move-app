/* eslint-disable no-console, no-param-reassign */

const { get, put } = require('../api');
const { green } = require('../colors');

exports.get = async (app) => {
  const response = await get('/app/views.json', { app });
  return response;
};

exports.put = async (app, data) => {
  data.app = app;
  data.revision = -1;
  delete data.views['（作業者が自分）'];
  await put('/preview/app/views.json', data);
  console.info(`${green('Copy Views')} [view: ${Object.keys(data.views).length}]`);
  console.info(Object.keys(data.views));
};
