const mongoose = require('mongoose');
const { ErrorHandler } = require('../utils/error');

const validateParamObjectId = (param) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
    const error = new ErrorHandler(422, `invalid ${param} ID`);
    return next(error);
  }

  next();
};

module.exports = {
  validateParamObjectId,
};
