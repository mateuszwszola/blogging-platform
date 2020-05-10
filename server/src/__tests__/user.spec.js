const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const User = require('../models/User');
const { setupDB, newId } = require('../../test-setup.js');
const { generateNewToken } = require('../middleware/auth');

const dummyUser = require('../seeds/user.seed.json')[0];

setupDB();

describe('User API tests', () => {
  describe('POST api/users - signup', () => {
    test('should return errors when empty body', async () => {
      expect.assertions(3);
      let res = await request.post('/api/users');

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(Object.keys(res.body.errors)).toHaveLength(3);
    });

    test('should return error when invalid name length', async () => {
      const res = await request.post('/api/users').send({
        ...dummyUser,
        name: 'M',
      });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors.name).toBeTruthy();
    });

    test('should return error when invalid email', async () => {
      const res = await request.post('/api/users').send({
        ...dummyUser,
        email: 'invalidemail',
      });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors.email).toBeTruthy();
    });

    test('should return error when invalid password length', async () => {
      const res = await request.post('/api/users').send({
        ...dummyUser,
        password: '123456',
      });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors.password).toBeTruthy();
    });

    test('should return error when email already exists', async () => {
      await User.create({ ...dummyUser });
      const res = await request.post('/api/users').send({
        ...dummyUser,
      });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors.email).toBeTruthy();
    });

    test('should save user to database and return user and token', async () => {
      const res = await request.post('/api/users').send(dummyUser);

      expect(res.statusCode).toBe(201);

      expect(res.body.user).toBeTruthy();
      expect(res.body.token).toBeTruthy();

      expect(res.body.user.name).toBe(dummyUser.name);
      expect(res.body.user.email).toBe(dummyUser.email);
      expect(res.body.user).not.toHaveProperty('password');
    });
  });

  describe('POST api/users/login', () => {
    test('should return errors when empty body', async () => {
      const res = await request.post('/api/users/login');

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(Object.keys(res.body.errors)).toHaveLength(2);
    });

    test('should return error when invalid credentials', async () => {
      const res = await request.post('/api/users/login').send({
        email: dummyUser.email,
        password: dummyUser.password,
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Invalid login credentials');
    });

    test('should login user and return user and token', async () => {
      await User.create(dummyUser);

      const res = await request.post('/api/users/login').send({
        email: dummyUser.email,
        password: dummyUser.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toBeTruthy();
      expect(res.body.token).toBeTruthy();

      expect(res.body.user.email).toBe(dummyUser.email);
      expect(res.body.user.name).toBe(dummyUser.name);
    });
  });

  describe('GET api/users/me', () => {
    test('should error when no token', async () => {
      const res = await request.get('/api/users/me');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Not authorized to access this resource');
    });

    test('should error when invalid token', async () => {
      const res = await request.get('/api/users/me').set('x-auth-token', '123');

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Not authorized to access this resource');
    });

    test('should error when user does not exists', async () => {
      const token = generateNewToken({ id: newId() });

      const res = await request.get('/api/users/me').set('x-auth-token', token);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Not authorized to access this resource');
    });

    test('should GET and return user', async () => {
      const user = await User.create(dummyUser);
      const token = user.generateAuthToken();

      const res = await request.get('/api/users/me').set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toBeTruthy();
      expect(res.body.user.email).toBe(dummyUser.email);
      expect(res.body.user.name).toBe(dummyUser.name);
    });
  });

  describe('PUT /api/users', () => {
    test('should return error when no name provided', async () => {});

    test('should return error when invalid name length', async () => {});

    test('should trim user name', async () => {});

    test('should return error when invalid bio length', async () => {});

    test('should reset user bio', async () => {});
  });
});
