const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

const limiter = new RateLimit({
  store: new MongoStore({
    uri: process.env.DB_URL,
  }),
  max: 100,
  windowMs: 15 * 60 * 1000,
});

module.exports = limiter;
