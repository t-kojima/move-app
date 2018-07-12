#!/usr/bin/env node

// const fs = require('fs');
// const fetch = require('node-fetch');
// const { promisify } = require('util');
const config = require('./config');
const { green } = require('./colors');
const axios = require('axios');

// const ENCODING = 'utf8';

const headers = (domain, username, password) => ({
  'X-Cybozu-Authorization': Buffer.from(`${username}:${password}`).toString('base64'),
  'Content-Type': 'application/json',
  Host: `${domain}:443`,
});

exports.create = async () => {
  const {
    domain, app, username, password,
  } = await config.load();

  const body = {
    name: 'テスト',
    // space: 1,
    // thread: 1
  };

  const response = await axios({
    method: 'post',
    url: `https://${domain}/k/v1/preview/app.json`,
    headers: headers(domain, username, password),
    data: body,
  });
  return response.data;
  // return JSON.stringify(response.data, null, '  ');
};

exports.deploy = async (app, revision) => {
  const {
    domain, _, username, password,
  } = await config.load();

  await axios({
    method: 'post',
    url: `https://${domain}/k/v1/preview/app/deploy.json`,
    headers: headers(domain, username, password),
    data: {
      apps: [
        {
          app,
          revision,
        },
      ],
    },
  });
  console.info(`${green('Deploy Success')} [app: ${app}]`);
  // return JSON.stringify(response.data, null, '  ');
};
