const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const routes = require('./api');
const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello world!' });
});

app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.url} Not Found` });
});

// 500 handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
