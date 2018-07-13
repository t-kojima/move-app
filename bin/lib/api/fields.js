/* eslint-disable no-console, no-param-reassign */

const { get, post, del } = require('../api');
const { green } = require('../colors');

exports.get = async app => {
  const response = await get('/app/form/fields.json', { app });
  return response;
};

exports.post = async (app, data) => {
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

  await post('/preview/app/form/fields.json', data);
  console.info(
    `${green('Copy Fields')} [field: ${Object.keys(data.properties).length}]`
  );
  console.info(Object.keys(data.properties));
};

exports.delete = async (app, data) => {
  const body = {
    app,
    revision: -1,
    fields: Object.keys(data.properties),
  };

  await del('/preview/app/form/fields.json', body);

  console.info(`${green('Delete Fields')} [field: ${body.fields.length}]`);
  console.info(body.fields);
};
