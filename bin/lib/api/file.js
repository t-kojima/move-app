/* eslint-disable no-console, no-param-reassign, no-unused-vars */

const config = require('../config');
const axios = require('axios');
const FormData = require('form-data');

exports.get = async key => {
  const { domain, app, username, password } = await config.load();

  const response = await axios({
    method: 'get',
    url: `https://${domain}/k/v1/file.json`,
    headers: {
      'X-Cybozu-Authorization': Buffer.from(`${username}:${password}`).toString(
        'base64'
      ),
      Host: `${domain}:443`,
    },
    data: { fileKey: key },
  });
  return response.data;
};

exports.post = async (filename, content) => {
  const { domain, app, username, password } = await config.load();

  const form = new FormData();
  form.append('file', content, filename);

  const response = await axios({
    method: 'post',
    url: `https://${domain}/k/v1/file.json`,
    headers: {
      'X-Cybozu-Authorization': Buffer.from(`${username}:${password}`).toString(
        'base64'
      ),
      'Content-Type': form.getHeaders()['content-type'],
      Host: `${domain}:443`,
    },
    data: form,
  });
  return response.data;
};
