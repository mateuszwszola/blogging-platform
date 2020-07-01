const multer = require('multer');
const DatauriParser = require('datauri/parser');
const path = require('path');

const storage = multer.memoryStorage();

const multerUploads = multer({
  storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      cb(new Error('Only upload files with jpg, jpeg or png format.'));
    }
    cb(null, true);
  },
}).single('photo');

const dUri = new DatauriParser();
/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 */
const dataUri = (req) => {
  return dUri.format(
    path.extname(req.file.originalname).toString(),
    req.file.buffer
  );
};

module.exports = {
  multerUploads,
  dataUri,
};
