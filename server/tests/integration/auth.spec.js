const request = require('supertest');
const { User } = require('../../src/models');
const dummyUser = require('../../seeds/user.seed.json')[0];

const { app } = require('../../src/app');

describe('Auth API tests', () => {
  describe('POST api/auth/signup', () => {
    test('returns errors when empty body', async () => {
      const res = await request(app).post('/api/auth/signup');

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(Object.keys(res.body.errors)).toHaveLength(3);
    });

    test('returns error when invalid name length', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...dummyUser,
          name: 'M',
        });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toHaveProperty('name');
    });

    test('returns error when invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...dummyUser,
          email: 'invalidemail',
        });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toHaveProperty('email');
    });

    test('returns error when invalid password length', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...dummyUser,
          password: '123',
        });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toHaveProperty('password');
    });

    test('returns error when email already exists', async () => {
      await User.create({ ...dummyUser });
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          ...dummyUser,
        });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toHaveProperty('email');
    });

    test('saves user to database and returns user and token', async () => {
      const res = await request(app).post('/api/auth/signup').send(dummyUser);

      expect(res.statusCode).toBe(201);

      expect(res.body.user).toBeTruthy();
      expect(res.body.token).toBeTruthy();

      expect(res.body.user.name).toBe(dummyUser.name);
      expect(res.body.user.email).toBe(dummyUser.email);
      expect(res.body.user).not.toHaveProperty('password');
    });
  });

  describe('POST api/auth/signin', () => {
    test('returns errors when empty body', async () => {
      const res = await request(app).post('/api/auth/signin');

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(Object.keys(res.body.errors)).toHaveLength(2);
    });

    test('returns error when invalid credentials', async () => {
      await User.create(dummyUser);

      const res = await request(app).post('/api/auth/signin').send({
        email: dummyUser.email,
        password: 'password',
      });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('message');
    });

    test('should login user and return user and token', async () => {
      await User.create(dummyUser);

      const res = await request(app).post('/api/auth/signin').send({
        email: dummyUser.email,
        password: dummyUser.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toBeTruthy();
      expect(res.body.token).toBeTruthy();

      expect(res.body.user.email).toBe(dummyUser.email);
      expect(res.body.user.name).toBe(dummyUser.name);
      expect(res.body).not.toHaveProperty('password');
    });
  });
});
