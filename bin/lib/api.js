#!/usr/bin/env node

const fs = require('fs');
const fetch = require('node-fetch');
const { promisify } = require('util');
const config = require('./config');
const axios = require('axios');

const ENCODING = 'utf8';

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
    headers: {
      'X-Cybozu-Authorization': Buffer.from(`${username}:${password}`).toString('base64'),
      'Content-Type': 'application/json',
      Host: `${domain}:443`,
    },
    data: body,
  });
  return JSON.stringify(response.data, null, '  ');
};

exports.deploy = async (body) => {
  const {
    domain, app, username, password,
  } = await config.load();
  const response = await axios({
    method: 'post',
    url: `https://${domain}/k/v1/preview/app/deploy.json`,
    headers: {
      'X-Cybozu-Authorization': Buffer.from(`${username}:${password}`).toString('base64'),
      'Content-Type': 'application/json',
      Host: `${domain}:443`,
    },
    data: {
      apps: [body],
    },
  });
  return JSON.stringify(response.data, null, '  ');
};

exports.fetch = async () => {
  const {
    domain, app, username, password,
  } = await config.load();

  const fetchApi = async (method) => {
    const url = `https://${domain}/k/v1/${method}`;
    const headers = {
      'X-Cybozu-Authorization': Buffer.from(`${username}:${password}`).toString('base64'),
      Host: `${domain}:443`,
    };

    // eslint-disable-next-line no-console
    console.info(`Fetch api from ${url}`);

    const response = await fetch(url, { headers });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message);
    } else {
      return JSON.stringify(json, null, '  ');
    }
  };

  const save = async (target, json) => {
    const filename = target.replace(/\//g, '_');
    await promisify(fs.mkdir)('.kintuba').catch(() => {});
    await promisify(fs.mkdir)('.kintuba/schema').catch(() => {});
    await promisify(fs.writeFile)(`.kintuba/schema/${filename}`, json, {
      encoding: ENCODING,
    });
  };

  const fetchWithSave = async (args) => {
    await fetchApi(args.method).then(json => save(args.file, json));
  };
  await fetchWithSave({ method: `app.json?id=${app}`, file: 'app.json' });
  await fetchWithSave({
    method: `app/views.json?app=${app}`,
    file: 'views.json',
  });
  await fetchWithSave({ method: `form.json?app=${app}`, file: 'form.json' });
  await fetchWithSave({
    method: `app/form/fields.json?app=${app}`,
    file: 'fields.json',
  });
};
