const mailgun = require('mailgun-js');
const config = require('../index');

const mailgunConfig = () =>
  mailgun({
    apiKey: config.mailgunApiKey,
    domain: config.mailgunDomain,
  });

module.exports = {
  mailgunConfig,
};
