const { config, uploader } = require('cloudinary');
const {
  cloudinaryCloudName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
} = require('../index');

const cloudinaryConfig = () =>
  config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
  });

module.exports = {
  cloudinaryConfig,
  uploader,
};
