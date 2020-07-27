const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');
const config = require('../config');

module.exports = async ({ app }) => {
  if (!config.isTest) {
    try {
      await mongooseLoader();
      console.log('DB connected!');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  }

  await expressLoader({ app });
};
