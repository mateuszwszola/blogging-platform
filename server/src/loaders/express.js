const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('../config');
const { handleNotFound, handleError } = require('../utils/error');

module.exports = async ({ app }) => {
  app.enable('trust proxy');
  app.use(cors({ origin: config.corsOrigin }));
  app.use(helmet());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  if (config.isDev) {
    app.use(morgan('dev'));
  }

  app.get('/', (req, res) => {
    res.json({ message: 'Hello world!' });
  });

  app.use('/api', require('../routes'));

  // 404 handler
  app.use(handleNotFound);
  // eslint-disable-next-line
  app.use((err, req, res, next) => {
    handleError(err, res);
  });

  return app;
};
