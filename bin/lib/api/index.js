/* eslint-disable no-console, no-unused-vars */

const config = require('../config');
const axios = require('axios');
const { green } = require('../colors');

const request = async (method, uri, body) => {
  const { domain, app, username, password } = await config.load();

  const response = await axios({
    method,
    url: `https://${domain}/k/v1${uri}`,
    headers: {
      'X-Cybozu-Authorization': Buffer.from(`${username}:${password}`).toString(
        'base64'
      ),
      'Content-Type': 'application/json',
      Host: `${domain}:443`,
    },
    data: body,
  });
  return response.data;
};

exports.get = (uri, body) => request('get', uri, body);
exports.post = (uri, body) => request('post', uri, body);
exports.put = (uri, body) => request('put', uri, body);
exports.del = (uri, body) => request('delete', uri, body);

exports.create = async () => {
  const body = {
    name: 'テスト',
    // space: 1,
    // thread: 1
  };

  const response = await this.post('/preview/app.json', body);
  console.info(`${green('Create Success')} [app: ${response.app}]`);
  const { domain, app, username, password } = await config.load();
  return {
    from: app,
    to: response.app,
  };
};

exports.deploy = async (app, revision) => {
  const body = {
    apps: [
      {
        app,
        revision,
      },
    ],
  };
  await this.post('/preview/app/deploy.json', body);
  console.info(`${green('Deploy Success')} [app: ${app}]`);
};
