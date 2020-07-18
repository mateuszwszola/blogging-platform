const mongoose = require('mongoose');
const config = require('../config');

module.exports = async (url = config.dbUrl, opts = {}) => {
  if (!config.isTest) {
    const connection = await mongoose.connect(url, {
      ...opts,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    return connection.connection.db;
  } else {
    return null;
  }
};
