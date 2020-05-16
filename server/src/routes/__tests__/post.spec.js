const supertest = require('supertest');
const { app } = require('../../app');
const User = require('../../models/User');
const Blog = require('../../models/Blog');
const Post = require('../../models/Post');
const {
  testValidationResults,
  checkForValidObjectId,
} = require('../../utils/tests/helpers');
const dummyUser = require('../../seeds/user.seed.json')[0];
const dummyBlogs = require('../../seeds/blog.seed.json');
const dummyPosts = require('../../seeds/post.seed.json');
const dummyPhotoURL = 'https://dummyimage.com/250';

const request = supertest(app);

describe('Post API tests', () => {
  let user;
  let token;
  beforeEach(async () => {
    user = await User.create({ ...dummyUser });
    token = user.generateAuthToken();
  });

  describe('POST api/posts/:blogId', () => {
    test('should error if no token provided', async () => {
      const blogId = global.newId();
      const res = await request.post(`/api/posts/${blogId}`);

      expect(res.statusCode).toBe(401);
      expect(typeof res.body.message).toBe('string');
    });

    test('should error if invalid blog ID', async () => {
      const res = await request
        .post('/api/posts/123')
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(typeof res.body.message).toBe('string');
    });

    test('should error if no required fields', async () => {
      const blogId = global.newId();
      const res = await request
        .post(`/api/posts/${blogId}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(typeof res.body.errors.title).toBe('string');
      expect(typeof res.body.errors.body).toBe('string');
    });

    test('should error if invalid title length', async () => {
      const blogId = global.newId();
      const res = await request
        .post(`/api/posts/${blogId}`)
        .set('x-auth-token', token)
        .send({ title: 'T' });

      expect.assertions(4);
      testValidationResults(expect, res, 'title');
    });

    test('should error if bgImgUrl is invalid url', async () => {
      const blogId = global.newId();
      const res = await request
        .post(`/api/posts/${blogId}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0], bgImgUrl: 'bg-img-url' });

      testValidationResults(expect, res, 'bgImgUrl');
      expect(res.body.errors.bgImgUrl.toLowerCase()).toMatch(/url/);
    });

    test('should error if invalid imgAttribution length', async () => {
      const blogId = global.newId();
      const res = await request
        .post(`/api/posts/${blogId}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0], imgAttribution: 'I' });

      testValidationResults(expect, res, 'imgAttribution');
      expect(res.body.errors.imgAttribution.toLowerCase()).toMatch(/char/);
    });

    test('should error if blog not found', async () => {
      const blogId = global.newId();
      const res = await request
        .post(`/api/posts/${blogId}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0] });

      expect(res.statusCode).toBe(404);
      expect(typeof res.body.message).toBe('string');
    });

    test('should error if user is not owner of the blog', async () => {
      const userId = global.newId();
      const blog = await Blog.create({ user: userId, ...dummyBlogs[0] });

      const res = await request
        .post(`/api/posts/${blog._id}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0] });

      expect(res.statusCode).toBe(401);
      expect(typeof res.body.message).toBe('string');
    });

    test('should create post', async () => {
      const blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });

      const res = await request
        .post(`/api/posts/${blog._id}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0] });

      expect.assertions(9);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('post');
      expect(res.body.post.blog).toBe(blog._id.toString());
      expect(res.body.post.user).toBe(user._id.toString());
      expect(typeof res.body.post.slug).toBe('string');

      for (let [key, value] of Object.entries(dummyPosts[0])) {
        expect(res.body.post[key]).toEqual(value);
      }
    });

    test('should create post with uploaded photo', async () => {
      const blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });

      const { title, body } = dummyPosts[0];

      const res = await request
        .post(`/api/posts/${blog._id}`)
        .set('x-auth-token', token)
        .field('title', title)
        .field('body', body)
        .attach('photo', 'src/fixtures/background.png');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('post');
      expect(res.body.post.blog).toBe(blog._id.toString());
      expect(res.body.post.user).toBe(user._id.toString());
      expect(typeof res.body.post.slug).toBe('string');
      expect(res.body.post.title).toBe(title);
      expect(res.body.post.body).toBe(body);
      expect(res.body.post.bgImgUrl).toMatch(/photos/);
      expect(checkForValidObjectId(res.body.post.photo)).toBe(true);
    });
  });

  describe('PUT api/posts/:postId', () => {
    test('should error if no token provided', async () => {
      const postId = global.newId();
      const res = await request.put(`/api/posts/${postId}`);

      expect(res.statusCode).toBe(401);
      expect(typeof res.body.message).toBe('string');
    });

    test('should error if invalid post ID', async () => {
      const res = await request
        .put('/api/posts/123')
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(typeof res.body.message).toBe('string');
    });

    test('should error if no required fields', async () => {
      const postId = global.newId();
      const res = await request
        .put(`/api/posts/${postId}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(typeof res.body.errors.title).toBe('string');
      expect(typeof res.body.errors.body).toBe('string');
    });

    test('should error if invalid title length', async () => {
      const postId = global.newId();
      const res = await request
        .put(`/api/posts/${postId}`)
        .set('x-auth-token', token)
        .send({ title: 'T' });

      expect.assertions(4);
      testValidationResults(expect, res, 'title');
    });

    test('should error if bgImgUrl is invalid url', async () => {
      const postId = global.newId();
      const res = await request
        .put(`/api/posts/${postId}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0], bgImgUrl: 'bg-img-url' });

      testValidationResults(expect, res, 'bgImgUrl');
      expect(res.body.errors.bgImgUrl.toLowerCase()).toMatch(/url/);
    });

    test('should error if invalid imgAttribution length', async () => {
      const postId = global.newId();
      const res = await request
        .put(`/api/posts/${postId}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0], imgAttribution: 'I' });

      testValidationResults(expect, res, 'imgAttribution');
      expect(res.body.errors.imgAttribution.toLowerCase()).toMatch(/char/);
    });

    test('should error if post not found', async () => {
      const postId = global.newId();
      const res = await request
        .put(`/api/posts/${postId}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0] });

      expect(res.statusCode).toBe(404);
      expect(typeof res.body.message).toBe('string');
    });

    test('should error if user is not owner of the post', async () => {
      const userId = global.newId();
      const blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });
      const post = await Post.create({
        user: userId,
        blog: blog._id,
        ...dummyPosts[0],
      });

      const res = await request
        .put(`/api/posts/${post._id}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0] });

      expect(res.statusCode).toBe(401);
      expect(typeof res.body.message).toBe('string');
    });

    test('should reset bgImgUrl and imgAttribution', async () => {
      const blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });
      const post = await Post.create({
        user: user._id,
        blog: blog._id,
        ...dummyPosts[0],
      });

      const res = await request
        .put(`/api/posts/${post._id}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0], bgImgUrl: '', imgAttribution: '' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('post');
      expect(res.body.post.bgImgUrl).toBe('');
      expect(res.body.post.imgAttribution).toBe('');
    });

    test('should update post', async () => {
      const blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });
      const post = await Post.create({
        user: user._id,
        blog: blog._id,
        ...dummyPosts[0],
      });

      const res = await request
        .put(`/api/posts/${post._id}`)
        .set('x-auth-token', token)
        .send(dummyPosts[1]);

      expect.assertions(9);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('post');
      expect(res.body.post._id).toBe(post._id.toString());
      expect(res.body.post.user).toBe(user._id.toString());
      expect(res.body.post.slug).toBe(post.slug);
      for (let [key, value] of Object.entries(dummyPosts[1])) {
        expect(res.body.post[key]).toBe(value);
      }
    });

    test('should update post with uploaded photo', async () => {
      const blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });
      const post = await Post.create({
        user: user._id,
        blog: blog._id,
        ...dummyPosts[0],
      });

      const { title, body } = dummyPosts[0];

      const res = await request
        .put(`/api/posts/${post._id}`)
        .set('x-auth-token', token)
        .field('title', title)
        .field('body', body)
        .attach('photo', 'src/fixtures/background.png');

      expect(res.statusCode).toBe(200);
      expect(res.body.post.title).toBe(title);
      expect(res.body.post.body).toBe(body);
      expect(res.body.post.bgImgUrl).toMatch(/photos/);
      expect(checkForValidObjectId(res.body.post.photo)).toBe(true);
    });
  });

  describe('DELETE api/posts/:postId', () => {
    test('should error if invalid post ID', async () => {
      const res = await request
        .delete(`/api/posts/123`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(typeof res.body.message).toBe('string');
    });

    test('should error if post not found', async () => {
      const postId = global.newId();
      const res = await request
        .delete(`/api/posts/${postId}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(404);
      expect(typeof res.body.message).toBe('string');
    });

    test('should error if user is not the owner of the post', async () => {
      const userId = global.newId();
      const post = await Post.create({ user: userId, ...dummyPosts[0] });

      const res = await request
        .delete(`/api/posts/${post._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(401);
      expect(typeof res.body.message).toBe('string');
    });

    test('should delete post', async () => {
      const post = await Post.create({ user: user._id, ...dummyPosts[0] });

      const res = await request
        .delete(`/api/posts/${post._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('post');
      expect(typeof res.body.message).toBe('string');
    });
  });

  describe('GET posts', () => {
    let blog;
    let post;
    beforeEach(async () => {
      blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });
      post = await Post.create({
        user: user._id,
        blog: blog._id,
        ...dummyPosts[0],
      });
    });

    describe('GET api/posts', () => {
      test('should return user posts', async () => {
        const res = await request.get('/api/posts').set('x-auth-token', token);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('posts');
        expect(res.body.posts.length).toBe(1);
      });
    });
  });
});
