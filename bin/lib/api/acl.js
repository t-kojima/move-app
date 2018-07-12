/* eslint-disable no-console, no-param-reassign */

const { get, put } = require('../api');
const { green } = require('../colors');

exports.app = {
  get: async (app) => {
    const response = await get('/app/acl.json', { app });
    return response;
  },
  put: async (app, data) => {
    data.app = app;
    data.revision = -1;
    await put('/app/acl.json', data);
    console.info(`${green('Copy app acl')} [right: ${data.rights.length}]`);
  },
};

exports.record = {
  get: async (app) => {
    const response = await get('/record/acl.json', { app });
    return response;
  },
  put: async (app, data) => {
    data.app = app;
    data.revision = -1;
    await put('/record/acl.json', data);
    console.info(`${green('Copy record acl')} [right: ${data.rights.length}]`);
  },
};

exports.field = {
  get: async (app) => {
    const response = await get('/field/acl.json', { app });
    return response;
  },
  put: async (app, data) => {
    data.app = app;
    data.revision = -1;
    await put('/field/acl.json', data);
    console.info(`${green('Copy field acl')} [right: ${data.rights.length}]`);
  },
};
