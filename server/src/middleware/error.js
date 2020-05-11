const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} Not Found`);
  res.statusCode = 404;
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  const body = {
    message: err.message || 'Internal Server Error',
  };
  if (process.env.NODE_ENV !== 'production') {
    body.stack = err.stack;
  }
  res.json(body);
};

module.exports = {
  notFound,
  errorHandler,
};
