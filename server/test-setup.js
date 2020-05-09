const mongoose = require('mongoose');
require('dotenv').config();

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

async function connect() {
  await mongoose.connect(global.__MONGO_URI__, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
}

module.exports = {
  setupDB() {
    beforeAll(async () => {
      await connect();
    });

    beforeEach(async () => {
      await removeAllCollections();
    });

    afterAll(async () => {
      await mongoose.connection.db.dropDatabase();
      await mongoose.disconnect();
    });
  },
  newId() {
    return mongoose.Types.ObjectId();
  },
};
