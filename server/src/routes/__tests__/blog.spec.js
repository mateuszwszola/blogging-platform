const supertest = require('supertest');
const { app } = require('../../app');
const User = require('../../models/User');
const Blog = require('../../models/Blog');

const request = supertest(app);

const dummyUsers = require('../../seeds/user.seed.json');
const dummyBlogs = require('../../seeds/blog.seed.json');
const dummyUser = dummyUsers[0];
const dummyPhotoURL = 'https://dummyimage.com/250';

const { testValidationResults } = require('../../utils/testsHelpers');

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
      await Blog.create({ name: dummyBlogs[0].name });

      const res = await request
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({ name: dummyBlogs[0].name });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(typeof res.body.message).toBe('string');
    });

    test('should create blog', async () => {
      const res = await request
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({ ...dummyBlogs[0] });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('blog');
      expect(res.body.blog.name).toBe(dummyBlogs[0].name);
      expect(typeof res.body.blog.slug).toBe('string');
      expect(res.body.blog.description).toBe(dummyBlogs[0].description);
      expect(res.body.blog.bgImg.photoURL).toBe(dummyBlogs[0].bgImgUrl);
      expect(res.body.blog.bgImg.imgAttribution).toBe(
        dummyBlogs[0].imgAttribution
      );

      expect(res.body.blog.user).toBe(user._id.toString());
    });

    test('should create blog with uploaded image', async () => {
      const res = await request
        .post('/api/blogs')
        .set('x-auth-token', token)
        .field('name', dummyBlogs[0].name)
        .attach('photo', 'src/fixtures/desk-background.jpg');

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('blog');
      expect(res.body.blog.name).toBe(dummyBlogs[0].name);
      expect(res.body.blog.bgImg.photoID).toBeTruthy();
      expect(res.body.blog.bgImg.photoURL).toBeTruthy();
    });
  });

  describe('PUT api/blogs/:blogId', () => {
    test('should error when name not provided', async () => {
      const blogId = global.newId();

      const res = await request
        .put(`/api/blogs/${blogId}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(res.body.errors.name).toBeTruthy();
    });

    test('should error when blog does not exists', async () => {
      const blogId = global.newId();

      const res = await request
        .put(`/api/blogs/${blogId}`)
        .set('x-auth-token', token)
        .send({ name: dummyBlogs[0].name });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBeTruthy();
    });

    test('should error when user is not the owner of the blog', async () => {
      const userId = global.newId();
      const blog = await Blog.create({ user: userId, ...dummyBlogs[0] });

      const res = await request
        .put(`/api/blogs/${blog._id}`)
        .set('x-auth-token', token)
        .send({ name: 'Different blog name' });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBeTruthy();
    });

    test('should update blog', async () => {
      const blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });

      const res = await request
        .put(`/api/blogs/${blog._id}`)
        .set('x-auth-token', token)
        .send({ ...dummyBlogs[1] });

      expect(res.statusCode).toBe(200);
      expect(res.body.blog.name).toBe(dummyBlogs[1].name);
      expect(res.body.blog.description).toBe(dummyBlogs[1].description);
      expect(res.body.blog.bgImg.photoURL).toBe(dummyBlogs[1].bgImgUrl);
      expect(res.body.blog.bgImg.imgAttribution).toBe(
        dummyBlogs[1].imgAttribution
      );
      expect(res.body.blog.bgImg.photoID).toBe(null);
    });

    test('should update blog with uploaded photo', async () => {
      const blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });

      const res = await request
        .put(`/api/blogs/${blog._id}`)
        .set('x-auth-token', token)
        .field('name', dummyBlogs[0].name)
        .attach('photo', 'src/fixtures/background.png');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blog');
      expect(res.body.blog).toHaveProperty('bgImg');
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

    test('should return empty blogs array', async () => {
      const res = await request.get('/api/blogs').set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs).toStrictEqual([]);
    });

    test('should return populated user blogs', async () => {
      const data = {
        user: {
          avatar: {
            photoURL: dummyPhotoURL,
          },
        },
        blog: {
          ...dummyBlogs[0],
        },
      };

      user = await User.findByIdAndUpdate(user._id, data.user);

      await Blog.create({ user: user._id, ...data.blog });

      const res = await request.get('/api/blogs').set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs.length).toBe(1);

      const blog = res.body.blogs[0];

      expect(blog.name).toBe(data.blog.name);

      expect(blog.user.name).toBe(user.name);
      expect(blog.user._id).toBe(user._id.toString());
      expect(blog.user.avatar.photoURL).toBe(data.user.avatar.photoURL);
    });
  });

  describe('GET api/blogs/all', () => {
    test('should return empty array of blogs', async () => {
      const res = await request.get('/api/blogs/all');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs).toStrictEqual([]);
    });

    test('should return blogs with populated user data', async () => {
      const data = {
        user: {
          avatar: {
            photoURL: dummyPhotoURL,
          },
        },
      };

      user = await User.findByIdAndUpdate(user._id, data.user, { new: true });
      await Blog.create({ user: user._id, ...dummyBlogs[0] });

      const res = await request.get('/api/blogs/all');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs.length).toBe(1);
      expect(res.body.blogs[0].user._id).toBe(user._id.toString());
      expect(res.body.blogs[0].user.name).toBe(user.name);
      expect(res.body.blogs[0].user.bio).toBe(user.bio);
      expect(res.body.blogs[0].user.avatar.photoURL).toBe(
        data.user.avatar.photoURL
      );
    });
  });

  describe('GET api/blogs/:blogId', () => {
    test('should return error when invalid object ID', async () => {
      const res = await request.get('/api/blogs/123');

      expect(res.statusCode).toBe(422);
      expect(typeof res.body.message).toBe('string');
    });

    test('should return error when blog does not exists', async () => {
      const blogId = global.newId();
      const res = await request.get(`/api/blogs/${blogId}`);

      expect(res.statusCode).toBe(404);
      expect(typeof res.body.message).toBe('string');
    });

    test('should return blog', async () => {
      const blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });

      const res = await request.get(`/api/blogs/${blog._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blog');
      expect(res.body.blog._id).toBe(blog._id.toString());
      expect(res.body.blog.name).toBe(blog.name);
      expect(res.body.blog.slug).toBe(blog.slug);
      expect(res.body.blog.description).toBe(blog.description);
      expect(res.body.blog.user._id).toBe(user._id.toString());
      expect(res.body.blog.user.name).toBe(user.name);
      expect(res.body.blog.user.bio).toBe(user.bio);
    });
  });

  describe('GET api/blogs/slug/:slugName', () => {
    test('should error when blog not found', async () => {
      const res = await request.get('/api/blogs/slug/slug');

      expect(res.statusCode).toBe(404);
      expect(typeof res.body.message).toBe('string');
    });

    test('should return blog', async () => {
      const blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });

      const res = await request.get(`/api/blogs/slug/${blog.slug}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blog');
      expect(res.body.blog._id).toBe(blog._id.toString());
      expect(res.body.blog.name).toBe(blog.name);
      expect(res.body.blog.slug).toBe(blog.slug);
      expect(res.body.blog.description).toBe(blog.description);
      expect(res.body.blog.user._id).toBe(user._id.toString());
      expect(res.body.blog.user.name).toBe(user.name);
      expect(res.body.blog.user.bio).toBe(user.bio);
    });
  });

  describe('GET api/blogs/user/:userId', () => {
    test('should error when invalid user id', async () => {
      const res = await request.get('/api/blogs/user/123');

      expect(res.statusCode).toBe(422);
      expect(typeof res.body.message).toBe('string');
    });

    test('should return user blogs', async () => {
      const blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });

      const res = await request.get(`/api/blogs/user/${user._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs.length).toBe(1);
      expect(res.body.blogs[0].name).toBe(blog.name);
      expect(res.body.blogs[0].description).toBe(blog.description);
      expect(res.body.blogs[0].user._id).toBe(user._id.toString());
    });
  });

  describe('DELETE api/blogs/:blogId', () => {
    test('should error when invalid blog ID', async () => {
      const res = await request
        .delete('/api/blogs/123')
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(typeof res.body.message).toBe('string');
    });

    test('should error when blog not found', async () => {
      const blogId = global.newId();
      const res = await request
        .delete(`/api/blogs/${blogId}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(404);
      expect(typeof res.body.message).toBe('string');
    });

    test('should error when user is not authorized to delete blog', async () => {
      const userId = global.newId();
      const blog = await Blog.create({ user: userId, ...dummyBlogs[0] });

      const res = await request
        .delete(`/api/blogs/${blog._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(404);
      expect(typeof res.body.message).toBe('string');
    });

    test('should delete a blog', async () => {
      const blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });

      const res = await request
        .delete(`/api/blogs/${blog._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(201);
      expect(typeof res.body.message).toBe('string');
      expect(res.body).toHaveProperty('blog');
      expect(res.body.blog.name).toBe(blog.name);
      expect(res.body.blog.slug).toBe(blog.slug);
      expect(res.body.blog.description).toBe(blog.description);
    });
  });
});
