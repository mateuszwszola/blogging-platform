const supertest = require('supertest');
const { app } = require('../../app');
const request = supertest(app);

const User = require('../../models/User');
const Photo = require('../../models/Photo');
const { generateNewToken } = require('../../middleware/auth');

const dummyUser = require('../../seeds/user.seed.json')[0];

describe('User API tests', () => {
  describe('POST api/users - signup', () => {
    test('should return errors when empty body', async () => {
      expect.assertions(3);
      const res = await request.post('/api/users');

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

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
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
      expect(typeof res.body.message).toBe('string');
    });

    test('should error when invalid token', async () => {
      const res = await request.get('/api/users/me').set('x-auth-token', '123');

      expect(res.statusCode).toBe(401);
      expect(typeof res.body.message).toBe('string');
    });

    test('should error when user does not exists', async () => {
      const token = generateNewToken({ id: global.newId() });

      const res = await request.get('/api/users/me').set('x-auth-token', token);

      expect(res.statusCode).toBe(401);
      expect(typeof res.body.message).toBe('string');
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

  describe('PUT api/users', () => {
    let user;
    let token;
    beforeEach(async () => {
      user = await User.create({ ...dummyUser, bio: 'User bio' });
      token = user.generateAuthToken();
    });

    test('should return error when invalid name length provided', async () => {
      const res = await request
        .put('/api/users')
        .set('x-auth-token', token)
        .send({
          name: 'M',
        });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toHaveProperty('name');
      expect(typeof res.body.errors.name).toBe('string');
    });

    test('should reset user bio', async () => {
      const res = await request
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

      const res = await request
        .put('/api/users')
        .set('x-auth-token', token)
        .send(data);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.bio).toBe(data.bio);
      expect(res.body.user.name).toBe(data.name);
      expect(res.body.user.name).toBe(data.name);
    });

    test('should set user avatar URL', async () => {
      const avatarURL = 'https://dummyimage.com/250';

      const res = await request
        .put('/api/users')
        .set('x-auth-token', token)
        .send({ avatarURL });

      expect(res.statusCode).toBe(200);
      expect(res.body.user.avatar.photoURL).toBe(avatarURL);
      expect(res.body.user.avatar.photoID).toBe(null);
    });
  });

  describe('POST api/users/photo', () => {
    let user;
    let token;
    beforeEach(async () => {
      user = await User.create({ ...dummyUser });
      token = user.generateAuthToken();
    });

    async function uploadAvatar() {
      return request
        .post('/api/users/photo')
        .set('x-auth-token', token)
        .attach('photo', 'src/fixtures/avatar.png');
    }

    test('should upload user avatar', async () => {
      const res = await uploadAvatar();

      expect(res.statusCode).toBe(200);
      expect(res.body.photoURL).toBeTruthy();
    });

    test('should delete old avatar', async () => {
      await uploadAvatar();
      await uploadAvatar();

      const numberOfPhotos = await Photo.countDocuments({}).exec();
      expect(numberOfPhotos).toBe(1);
    });
  });
});
