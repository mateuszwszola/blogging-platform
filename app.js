const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./api');
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

// example logger handler
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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
