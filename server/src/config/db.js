const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log('DB connected!');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDb;
