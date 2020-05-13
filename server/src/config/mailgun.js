const mailgun = require('mailgun-js');
const config = require('./index');

const mg = mailgun({
  apiKey: config.mailgunApiKey,
  domain: config.mailgunDomain,
});

module.exports = mg;
