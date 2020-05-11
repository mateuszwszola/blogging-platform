const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const errorMiddlewares = require('./middleware/error');

const app = express();

app.enable('trust proxy'); // for rate limiting by Client IP

// Connect to the db
if (process.env.NODE_ENV !== 'testing') {
  require('./config/db')();
}

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello world!' });
});

app.use('/api', require('./routes'));

// 404 handler
app.use(errorMiddlewares.notFound);

app.use(errorMiddlewares.errorHandler);

module.exports = app;
