const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 1000000, // max file size 1000000 bytes = 1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      cb(new Error('Only upload files with jpg or jpeg format.'));
    }
    cb(undefined, true);
  },
});

module.exports = upload;
