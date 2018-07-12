/* eslint-disable no-console, no-param-reassign */

const config = require('../config');
const { green } = require('../colors');
const axios = require('axios');

const headers = (domain, username, password) => ({
  'X-Cybozu-Authorization': Buffer.from(`${username}:${password}`).toString('base64'),
  'Content-Type': 'application/json',
  Host: `${domain}:443`,
});

exports.get = async () => {
  const {
    domain, app, username, password,
  } = await config.load();

  const response = await axios({
    method: 'get',
    url: `https://${domain}/k/v1/app/settings.json`,
    headers: headers(domain, username, password),
    data: { app },
  });
  return response.data;
};

exports.put = async (app, data) => {
  const {
    domain, _, username, password,
  } = await config.load();

  data.app = app;
  data.revision = -1;

  console.log(`${green('Copy Settings')} ${JSON.stringify(data, null, '  ')}`);

  const response = await axios({
    method: 'put',
    url: `https://${domain}/k/v1/preview/app/settings.json`,
    headers: headers(domain, username, password),
    data,
  });
  return response.data;
};
