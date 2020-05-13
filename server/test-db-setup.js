const mongoose = require('mongoose');
const cuid = require('cuid');
const _ = require('lodash');
const User = require('./src/models/User');
const Post = require('./src/models/Post');
const Blog = require('./src/models/Blog');
const Photo = require('./src/models/Photo');
const Comment = require('./src/models/Comment');

const models = { User, Post, Blog, Photo, Comment };

const { dbUrl } = require('./src/config');

global.newId = () => {
  return mongoose.Types.ObjectId();
};

const remove = (collection) => {
  return new Promise((resolve, reject) => {
    collection
      .deleteMany()
      .then(resolve)
      .catch((err) => {
        return reject(err);
      });
  });
};

beforeEach(async (done) => {
  const db = cuid();
  function clearDB() {
    return Promise.all(
      _.map(mongoose.connection.collections, (c) => remove(c))
    );
  }

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(dbUrl + db, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      await clearDB();
      await Promise.all(Object.keys(models).map((name) => models[name].init()));
    } catch (err) {
      console.log('connection error');
      console.error(err);
      throw err;
    }
  } else {
    await clearDB();
  }
  done();
});

afterEach(async (done) => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  return done();
});

afterAll((done) => {
  return done();
});
