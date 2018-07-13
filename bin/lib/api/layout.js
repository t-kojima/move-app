/* eslint-disable no-console, no-param-reassign */

const { get, put } = require('../api');
const { green } = require('../colors');

const sum = source => source.reduce((prev, cur) => prev + cur.fields.length, 0);

exports.get = async app => {
  const response = await get('/app/form/layout.json', { app });
  return response;
};

exports.put = async (app, data) => {
  data.app = app;
  data.revision = -1;
  await put('/preview/app/form/layout.json', data);
  console.info(`${green('Copy Layout')} [field: ${sum(data.layout)}]`);
  console.info(
    [].concat(...data.layout.map(a => a.fields.map(b => b.code || b.elementId)))
  );
};
