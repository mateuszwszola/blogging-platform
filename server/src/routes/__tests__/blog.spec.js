const supertest = require('supertest');
const { app } = require('../../app');
const User = require('../../models/User');
const Blog = require('../../models/Blog');

const request = supertest(app);

const dummyUser = require('../../seeds/user.seed.json')[0];
const dummyBlog = {
  name: 'Blog name',
  description: 'Blog description',
  bgImgUrl: 'https://dummyimage.com/600x400',
  imgAttribution: 'Image from dummyimage.com',
};

function testValidationResults(expect, res, field) {
  expect(res.statusCode).toBe(422);
  expect(res.body).toHaveProperty('errors');
  expect(res.body.errors).toHaveProperty(field);
  expect(typeof res.body.errors[field]).toBe('string');
}

describe('Blog API tests', () => {
  let user;
  let token;
  beforeEach(async () => {
    user = await User.create({ ...dummyUser });
    token = user.generateAuthToken();
  });

  describe('POST api/blogs', () => {
    test('should error when no token', async () => {
      const res = await request.post('/api/blogs');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });

    test('should error when no name provided', async () => {
      const res = await request.post('/api/blogs').set('x-auth-token', token);

      expect.assertions(4);
      testValidationResults(expect, res, 'name');
    });

    test('should error when invalid name length', async () => {
      const res = await request
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({ name: 'B' });

      expect.assertions(4);
      testValidationResults(expect, res, 'name');
    });

    test('should error when invalid description length', async () => {
      const description = 'Blog description'.repeat(9);

      const res = await request
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({ name: 'Blog name', description });

      expect.assertions(4);
      testValidationResults(expect, res, 'description');
    });

    test('should error when invalid imgAttribution length', async () => {
      const imgAttribution = 'Image Attribution'.repeat(4);

      const res = await request
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({ name: 'Blog name', imgAttribution });

      expect.assertions(4);
      testValidationResults(expect, res, 'imgAttribution');
    });

    test('should error when bgImgUrl is invalid url', async () => {
      const res = await request
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({ name: 'Blog name', bgImgUrl: 'image-url' });

      expect.assertions(4);
      testValidationResults(expect, res, 'bgImgUrl');
    });

    test('should error when blog with that name already exists', async () => {
      await Blog.create({ name: dummyBlog.name });

      const res = await request
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({ name: dummyBlog.name });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });

    test('should create blog', async () => {
      const res = await request
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({ ...dummyBlog });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('blog');
      expect(res.body.blog.name).toBe(dummyBlog.name);
      expect(res.body.blog.description).toBe(dummyBlog.description);
      expect(res.body.blog.bgImg.photoURL).toBe(dummyBlog.bgImgUrl);
      expect(res.body.blog.bgImg.imgAttribution).toBe(dummyBlog.imgAttribution);
      expect(res.body.blog.user).toBe(user._id.toString());
    });

    test('should create blog with uploaded image', async () => {
      const res = await request
        .post('/api/blogs')
        .set('x-auth-token', token)
        .field('name', dummyBlog.name)
        .attach('photo', 'src/fixtures/desk-background.jpg');

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('blog');
      expect(res.body.blog.name).toBe(dummyBlog.name);
      expect(res.body.blog.bgImg.photoID).toBeTruthy();
      expect(res.body.blog.bgImg.photoURL).toBeTruthy();
    });
  });

  describe('GET api/blogs', () => {
    test('should error when no token', async () => {
      const res = await request.get('/api/blogs');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });

    test.only('should return empty blogs array', async () => {
      const res = await request.get('/api/blogs').set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs).toStrictEqual([]);
    });

    // test('should return populated user blogs', async () => {});
  });
});
