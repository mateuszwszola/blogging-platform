const { isProd } = require('../config');

const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} Not Found`);
  res.statusCode = 404;
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode === 200 ? 500 : res.statusCode;

  const body = {
    message: err.message || 'Internal Server Error',
  };

  if (!isProd) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};

module.exports = {
  notFound,
  errorHandler,
};
