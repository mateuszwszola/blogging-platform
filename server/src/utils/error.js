const { isProd } = require('../config');

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleNotFound = (req, res, next) => {
  const error = new ErrorHandler(404, `Route ${req.originalUrl} Not Found`);
  next(error);
};

const handleError = (err, res) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const body = {
    message,
  };

  if (!isProd) {
    body.stack = err.stack;
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    ...body,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
  handleNotFound,
};
