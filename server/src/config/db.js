const mongoose = require('mongoose');
const config = require('./');

exports.connect = async (url = config.dbUrl, opts = {}) => {
  try {
    await mongoose.connect(url, {
      ...opts,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log('DB connected!');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};
