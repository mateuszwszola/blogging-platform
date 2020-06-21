const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../config/s3');

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.match(/image\/(jpeg|jpg|png)$/)) {
    cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: 'blogging-platform-storage',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

module.exports = upload;
