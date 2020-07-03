const { config, uploader, url } = require('cloudinary').v2;
const {
  cloudinaryCloudName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
} = require('../config');

const cloudinaryConfig = () =>
  config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
  });

module.exports = {
  cloudinaryConfig,
  uploader,
  url,
};
