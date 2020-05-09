const request = require('supertest');
const mongoose = require('mongoose');
const UserModel = require('../models/User');
const app = require('../app');

describe('User API test', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  describe('POST api/users', () => {
    test('should return errors', async () => {
      let response = await request(app).post('/api/users');
      expect(response.statusCode).toBe(422);
    });
  });
});
