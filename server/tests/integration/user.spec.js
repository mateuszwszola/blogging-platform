const request = require('supertest');
const sinon = require('sinon');
const { User } = require('../../src/models');
const { generateNewToken } = require('../../src/middleware/auth');
const dummyUser = require('../../seeds/user.seed.json')[0];

const { uploader } = require('../../src/services/cloudinary');

sinon.stub(uploader, 'upload').callsFake(() => {
  return new Promise((resolve) => {
    return resolve({
      secure_url: 'image-url',
    });
  });
});

describe('User API tests', () => {
  describe('GET api/users/me', () => {
    test('should error when no token', async () => {
      const res = await request(global.app).get('/api/users/me');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    test('should error when invalid token', async () => {
      const res = await request(global.app)
        .get('/api/users/me')
        .set('x-auth-token', '123');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    test('should error when user does not exists', async () => {
      const token = generateNewToken({ id: global.newId() });

      const res = await request(global.app)
        .get('/api/users/me')
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    test('should GET and return user', async () => {
      const user = await User.create(dummyUser);
      const token = user.generateAuthToken();

      const res = await request(global.app)
        .get('/api/users/me')
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe(dummyUser.email);
      expect(res.body.user.name).toBe(dummyUser.name);
    });
  });

  describe('PUT api/users', () => {
    let user;
    let token;
    beforeEach(async () => {
      user = await User.create({ ...dummyUser, bio: 'User bio' });
      token = user.generateAuthToken();
    });

    test('should return error when invalid name length provided', async () => {
      const res = await request(global.app)
        .put('/api/users')
        .set('x-auth-token', token)
        .send({
          name: 'M',
        });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toHaveProperty('name');
    });

    test('should reset user bio', async () => {
      const res = await request(global.app)
        .put('/api/users')
        .set('x-auth-token', token)
        .send({
          name: dummyUser.name,
          bio: '',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.bio).toBe('');
    });

    test('should update user info', async () => {
      const data = {
        name: 'Jason',
        bio: 'My name is Jason',
      };

      const res = await request(global.app)
        .put('/api/users')
        .set('x-auth-token', token)
        .send(data);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.bio).toBe(data.bio);
      expect(res.body.user.name).toBe(data.name);
    });
  });

  describe('POST api/users/photo', () => {
    let user;
    let token;
    beforeEach(async () => {
      user = await User.create({ ...dummyUser });
      token = user.generateAuthToken();
    });

    test('should upload user avatar', async () => {
      const res = await request(global.app)
        .post('/api/users/photo')
        .set('x-auth-token', token)
        .attach('photo', 'fixtures/avatar.png');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('avatarURL');
    });
  });
});
