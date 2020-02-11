const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDb = require('./config/db');
const middlewares = require('./middlewares');

const app = express();

connectDb();

app.use(morgan('common'));
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello world!' });
});

app.use('/api', require('./api'));

// 404 handler
app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

module.exports = app;
