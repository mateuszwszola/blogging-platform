const aws = require('aws-sdk');
const config = require('../index');

aws.config.update({
  accessKeyId: config.awsAccessKeyId,
  secretAccessKey: config.awsSecretKey,
  region: 'eu-north-1',
});

const s3 = new aws.S3();

module.exports = {
  s3,
};
