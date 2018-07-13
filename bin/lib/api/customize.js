/* eslint-disable no-console, no-param-reassign */

const { get, put } = require('../api');
const file = require('./file');
const { green } = require('../colors');

exports.get = async app => {
  const response = await get('/app/customize.json', { app });
  return response;
};

const convertFileKey = async data => {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of data.desktop.js.filter(i => i.type === 'FILE')) {
    // eslint-disable-next-line no-await-in-loop
    const content = await file.get(item.file.fileKey);
    // eslint-disable-next-line no-await-in-loop
    const response = await file.post(item.file.name, content);
    item.file.fileKey = response.fileKey;
  }
};

exports.put = async (app, data) => {
  data.app = app;
  data.revision = -1;
  await convertFileKey(data);
  await put('/preview/app/customize.json', data);
  const jscount =
    (data.desktop.js || []).length + (data.mobile.js || []).length;
  const csscount =
    (data.desktop.css || []).length + (data.mobile.css || []).length;
  console.info(`${green('Copy Customize')} [js: ${jscount}, css: ${csscount}]`);
};
