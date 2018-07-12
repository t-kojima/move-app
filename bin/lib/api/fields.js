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
    url: `https://${domain}/k/v1/app/form/fields.json`,
    headers: headers(domain, username, password),
    data: { app },
  });
  return response.data;
};

exports.post = async (app, data) => {
  const {
    domain, _, username, password,
  } = await config.load();

  data.app = app;
  data.revision = -1;

  delete data.properties['レコード番号'];
  delete data.properties['ステータス'];
  delete data.properties['カテゴリー'];
  delete data.properties['作業者'];
  delete data.properties['作成者'];
  delete data.properties['更新者'];
  delete data.properties['作成日時'];
  delete data.properties['更新日時'];

  console.log(`${green('Copy Fields')} [field: ${Object.keys(data.properties).length}]`);
  console.log(Object.keys(data.properties));

  const response = await axios({
    method: 'post',
    url: `https://${domain}/k/v1/preview/app/form/fields.json`,
    headers: headers(domain, username, password),
    data,
  });
  return response.data;
};

exports.delete = async (app, data) => {
  const {
    domain, _, username, password,
  } = await config.load();

  const body = {
    app,
    revision: -1,
    fields: Object.keys(data.properties),
  };

  console.log(`${green('Delete Fields')} [field: ${body.fields.length}]`);
  console.log(body.fields);

  const response = await axios({
    method: 'delete',
    url: `https://${domain}/k/v1/preview/app/form/fields.json`,
    headers: headers(domain, username, password),
    data: body,
  });
  return response.data;
};
