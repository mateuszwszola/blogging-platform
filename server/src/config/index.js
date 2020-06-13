const { merge } = require('lodash');
const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  isProd: env === 'production',
  port: process.env.PORT || 3001,
  secrets: {
    jwt: process.env.JWT_KEY,
    jwtExp: process.env.JWT_EXP || 3600,
  },
  // mailgunApiKey: process.env.MAILGUN_API_KEY,
  // mailgunDomain: process.env.MAILGUN_DOMAIN,
};

let envConfig = {};

switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./dev').config;
    break;
  case 'test':
  case 'testing':
    envConfig = require('./testing').config;
    break;
  case 'prod':
  case 'production':
    envConfig = require('./prod').config;
    break;
  default:
    envConfig = require('./dev').config;
}

module.exports = merge(baseConfig, envConfig);
