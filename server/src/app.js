const express = require('express');
require('express-async-errors');
const config = require('./config');

async function expressApp() {
  const app = express();
  await require('./loaders')({ app });
  return app;
}

async function startServer() {
  const app = await expressApp();

  app.listen(config.port, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log(`Server listens on port ${config.port}`);
    }
  });
}

module.exports = {
  expressApp,
  startServer,
};
