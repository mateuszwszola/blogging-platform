const supertest = require('supertest');
const { User } = require('../../src/models');
const dummyUsers = require('../../seeds/user.seed.json');

const { app } = require('../../src/app');
const request = supertest(app);

describe('Profile API tests', () => {
  let user;
  let token;

  beforeEach(async () => {
    user = await User.create({ ...dummyUsers[0] });
    token = user.generateAuthToken();
  });

  describe('GET api/users/profile/:userId', () => {
    test('should error 404', async () => {
      const userId = global.newId();

      const res = await request.get(`/api/users/profile/${userId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('should return user profile', async () => {
      const res = await request.get(`/api/users/profile/${user._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('profile');
      expect(res.body.profile.name).toBe(dummyUsers[0].name);
      expect(res.body.profile.bio).toBe(dummyUsers[0].bio);
    });
  });

  describe('POST api/users/profile/:userId/follow', () => {
    let profile;

    beforeEach(async () => {
      profile = await User.create({ ...dummyUsers[1] });
    });

    test('should error 400', async () => {
      const res = await request
        .post(`/api/users/profile/${user._id}/follow`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    test('should follow profile', async () => {
      const res = await request
        .post(`/api/users/profile/${profile._id}/follow`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('profile');
      expect(res.body.profile.isFollowing).toBe(true);
    });
  });

  describe('DELETE api/users/profile/:userId/follow', () => {
    let profile;

    beforeEach(async () => {
      profile = await User.create({ ...dummyUsers[1] });
      await user.follow(profile._id);
    });

    test('should error 400', async () => {
      const res = await request
        .delete(`/api/users/profile/${user._id}/follow`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    test('should unfollow profile', async () => {
      const res = await request
        .delete(`/api/users/profile/${profile._id}/follow`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('profile');
      expect(res.body.profile.isFollowing).toBe(false);
    });
  });
});
