const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const { connect } = require('./config/db');

const errorMiddlewares = require('./middleware/error');

const app = express();
exports.app = app;

app.enable('trust proxy'); // for rate limiting by Client IP

if (config.isDev) {
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

exports.start = async () => {
  await connect();
  app.listen(config.port, () => {
    console.log(`Server listens on port ${config.port}`);
  });
};
