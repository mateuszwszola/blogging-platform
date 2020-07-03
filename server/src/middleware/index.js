const { auth } = require('./auth');
const { multerUploads, dataUri } = require('./multer');
const { validate } = require('./validate');

module.exports = {
  auth,
  multerUploads,
  dataUri,
  validate,
};
