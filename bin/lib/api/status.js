/* eslint-disable no-console, no-param-reassign */

const { get, put } = require('../api');
const { green } = require('../colors');

exports.get = async app => {
  const response = await get('/app/status.json', { app });
  return response;
};

exports.put = async (app, data) => {
  data.app = app;
  data.revision = -1;
  await put('/preview/app/status.json', data);
  console.info(
    `${green('Copy Process')} [status: ${Object.keys(data.states).length}]`
  );
  console.info(
    `[${Object.keys(data.states)}] => ${data.enable ? 'enabled' : 'disabled'}`
  );
};

exports.delete = async app => {
  const body = {
    app,
    revision: -1,
    enable: false,
  };
  await put('/preview/app/status.json', body);
  console.info(`${green('Delete Process')} [disabled]`);
};
