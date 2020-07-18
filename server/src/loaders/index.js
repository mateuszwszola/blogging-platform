const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');

module.exports = async ({ app }) => {
  try {
    const mongoConnection = await mongooseLoader();
    if (mongoConnection) {
      console.log('DB connected!');
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  await expressLoader({ app });
};
