const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const { connect } = require('./config/db');
const { handleNotFound, handleError } = require('./utils/error');
const { cloudinaryConfig } = require('./services/cloudinary');

const app = express();

cloudinaryConfig();

app.enable('trust proxy'); // for rate limiting by Client IP

if (config.isDev) {
  app.use(morgan('dev'));
}

app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello world!' });
});

app.use('/api', require('./routes'));

// 404 handler
app.use(handleNotFound);
// eslint-disable-next-line
app.use((err, req, res, next) => {
  handleError(err, res);
});

const start = async () => {
  await connect(); // connect DB
  app.listen(config.port, () => {
    console.log(`Server listens on port ${config.port}`);
  });
};

module.exports = {
  app,
  start,
};
