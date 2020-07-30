const request = require('supertest');
const sinon = require('sinon');
const { User, Blog, Post } = require('../../src/models');
const { testValidationResults } = require('../testsHelpers');
const { uploader } = require('../../src/services/cloudinary');

sinon.stub(uploader, 'upload').callsFake(() => {
  return new Promise((resolve) => {
    return resolve({
      secure_url: 'image-url',
      eager: [{ secure_url: 'large-image-url' }],
    });
  });
});

describe('Blog API tests', () => {
  let user;
  let token;
  beforeEach(async () => {
    user = await User.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'password123',
      bio: 'user bio',
    });
    token = user.generateAuthToken();
  });

  const blogData = {
    name: 'Blog name',
    description: 'Blog description',
    bgImgUrl: 'https://picsum.photos/200',
    imgAttribution: 'photo by ... on ...',
  };

  describe('POST /api/blogs', () => {
    test('should error when no token', async () => {
      const res = await request(global.app).post('/api/blogs');

      expect(res.statusCode).toBe(401);
    });

    test('should error when no name provided', async () => {
      const res = await request(global.app)
        .post('/api/blogs')
        .set('x-auth-token', token);

      expect.assertions(3);
      testValidationResults(expect, res, 'name');
    });

    test('should error when invalid name length', async () => {
      const res = await request(global.app)
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({ name: 'B' });

      expect.assertions(3);
      testValidationResults(expect, res, 'name');
    });

    test('should error when invalid description length', async () => {
      const description = 'Blog description'.repeat(9);

      const res = await request(global.app)
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({ name: 'Blog name', description });

      expect.assertions(3);
      testValidationResults(expect, res, 'description');
    });

    test('should error when invalid imgAttribution length', async () => {
      const imgAttribution = 'Image Attribution'.repeat(4);

      const res = await request(global.app)
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({ name: 'Blog name', imgAttribution });

      expect.assertions(3);
      testValidationResults(expect, res, 'imgAttribution');
    });

    test('should error when bgImgUrl is invalid url', async () => {
      const res = await request(global.app)
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({ name: 'Blog name', bgImgUrl: 'image-url' });

      expect.assertions(3);
      testValidationResults(expect, res, 'bgImgUrl');
    });

    test('should error when blog with that name already exists', async () => {
      const name = 'Blog Name';

      await Blog.create({ name });

      const res = await request(global.app)
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send({ name });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('message');
    });

    test('should create a blog', async () => {
      const res = await request(global.app)
        .post('/api/blogs')
        .set('x-auth-token', token)
        .send(blogData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('blog');
      expect(res.body.blog).toHaveProperty('slug');
      expect(res.body.blog.user).toBe(user._id.toString());
      expect(res.body.blog.name).toBe(blogData.name);
      expect(res.body.blog.description).toBe(blogData.description);
      expect(res.body.blog.bgImg).toHaveProperty('image_url');
      expect(res.body.blog.bgImg).toHaveProperty('large_image_url');
      expect(res.body.blog.bgImg.img_attribution).toBe(blogData.imgAttribution);
    });

    test('should create a blog with uploaded photo', async () => {
      const res = await request(global.app)
        .post('/api/blogs')
        .set('x-auth-token', token)
        .attach('photo', 'fixtures/background.png')
        .field('name', blogData.name)
        .field('imgAttribution', blogData.imgAttribution);

      expect(res.statusCode).toBe(201);
      expect(res.body.blog.name).toBe(blogData.name);
      expect(res.body.blog.bgImg).toHaveProperty('image_url');
      expect(res.body.blog.bgImg).toHaveProperty('large_image_url');
      expect(res.body.blog.bgImg.img_attribution).toBe(blogData.imgAttribution);
    });
  });

  describe('PUT /api/blogs/:blogId', () => {
    test('should error when no token', async () => {
      const blog = await Blog.create({ user: user._id, name: blogData.name });

      const res = await request(global.app).put(`/api/blogs/${blog._id}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    test('should error when no blog name provided', async () => {
      const blog = await Blog.create({ user: user._id, name: blogData.name });

      const res = await request(global.app)
        .put(`/api/blogs/${blog._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(res.body.errors.name).toBeTruthy();
    });

    test('should error when blog does not exists', async () => {
      const blogId = global.newId();

      const res = await request(global.app)
        .put(`/api/blogs/${blogId}`)
        .set('x-auth-token', token)
        .send({ name: blogData.name });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBeTruthy();
    });

    test('should error when user is not the owner of the blog', async () => {
      const userId = global.newId();
      const blog = await Blog.create({ user: userId, name: blogData.name });

      const res = await request(global.app)
        .put(`/api/blogs/${blog._id}`)
        .set('x-auth-token', token)
        .send({ name: 'Different blog name' });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBeTruthy();
    });

    test('should error when new blog name is not unique', async () => {
      const blogs = await Blog.create([
        { user: user._id, name: 'Blog name #1' },
        { user: user._id, name: 'Blog name #2' },
      ]);

      const res = await request(global.app)
        .put(`/api/blogs/${blogs[0]._id}`)
        .set('x-auth-token', token)
        .send({ name: blogs[1].name });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('message');
    });

    test('should update blog', async () => {
      const blog = await Blog.create({ user: user._id, name: blogData.name });

      const newBlogData = {
        name: 'New Name',
        description: 'New description',
        bgImgUrl: 'https://picsum.photos/300',
        imgAttribution: 'photo by someone',
      };

      const res = await request(global.app)
        .put(`/api/blogs/${blog._id}`)
        .set('x-auth-token', token)
        .send({ ...newBlogData });

      expect(res.statusCode).toBe(200);
      expect(res.body.blog.name).toBe(newBlogData.name);
      expect(res.body.blog.description).toBe(newBlogData.description);
      expect(res.body.blog.bgImg).toHaveProperty('image_url');
      expect(res.body.blog.bgImg).toHaveProperty('large_image_url');
      expect(res.body.blog.bgImg.img_attribution).toBe(
        newBlogData.imgAttribution
      );
    });

    test('should update blog with uploaded photo', async () => {
      const blog = await Blog.create({ user: user._id, name: blogData.name });

      const newName = 'New Name';

      const res = await request(global.app)
        .put(`/api/blogs/${blog._id}`)
        .set('x-auth-token', token)
        .attach('photo', 'fixtures/background.png')
        .field('name', newName);

      expect(res.statusCode).toBe(200);
      expect(res.body.blog.name).toBe(newName);
      expect(res.body.blog.bgImg).toHaveProperty('image_url');
      expect(res.body.blog.bgImg).toHaveProperty('large_image_url');
    });
  });

  describe('GET /api/blogs', () => {
    test('should error when no token', async () => {
      const res = await request(global.app).get('/api/blogs');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    test('should return empty blogs array', async () => {
      const res = await request(global.app)
        .get('/api/blogs')
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs).toStrictEqual([]);
    });

    test('should return populated user blogs array', async () => {
      const blogs = [
        {
          name: 'Blog name #1',
          user: user._id,
        },
        {
          name: 'Blog name #2',
          user: user._id,
        },
      ];

      user = await User.findByIdAndUpdate(
        user._id,
        { avatar: { image_url: 'avatar_url' } },
        { new: true }
      );

      await Blog.create(blogs);

      const res = await request(global.app)
        .get('/api/blogs')
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs.length).toBe(2);

      const [blogOne, blogTwo] = res.body.blogs;

      expect(blogOne.user.name).toBe(user.name);
      expect(blogOne.user.bio).toBe(user.bio);
      expect(blogOne.user).toHaveProperty('avatar');
      expect(blogTwo.user.name).toBe(user.name);
      expect(blogTwo.user.bio).toBe(user.bio);
      expect(blogTwo.user).toHaveProperty('avatar');
    });
  });

  describe('GET /api/blogs/all', () => {
    test('should return empty array of blogs', async () => {
      const res = await request(global.app).get('/api/blogs/all');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs).toStrictEqual([]);
    });

    test('should return blogs with populated user data', async () => {
      const blogs = [
        {
          name: 'Blog name #1',
          user: user._id,
        },
        {
          name: 'Blog name #2',
          user: user._id,
        },
      ];

      user = await User.findByIdAndUpdate(
        user._id,
        { avatar: { image_url: 'avatar_url' } },
        { new: true }
      );

      await Blog.create(blogs);

      const res = await request(global.app).get('/api/blogs/all');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs.length).toBe(2);

      const [blogOne, blogTwo] = res.body.blogs;

      expect(blogOne.user.name).toBe(user.name);
      expect(blogOne.user.bio).toBe(user.bio);
      expect(blogOne.user).toHaveProperty('avatar');
      expect(blogTwo.user.name).toBe(user.name);
      expect(blogTwo.user.bio).toBe(user.bio);
      expect(blogOne.user).toHaveProperty('avatar');
    });
  });

  describe('GET /api/blogs/:blogId', () => {
    test('should return error when invalid object ID', async () => {
      const res = await request(global.app).get('/api/blogs/123');

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('message');
    });

    test('should return error when blog does not exists', async () => {
      const blogId = global.newId();
      const res = await request(global.app).get(`/api/blogs/${blogId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('should return blog', async () => {
      const blog = await Blog.create({
        user: user._id,
        name: blogData.name,
        description: blogData.description,
      });

      const res = await request(global.app).get(`/api/blogs/${blog._id}`);

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

  describe('GET /api/blogs/slug/:slugName', () => {
    test('should error when blog not found', async () => {
      const res = await request(global.app).get('/api/blogs/slug/slug');

      expect(res.statusCode).toBe(404);
      expect(typeof res.body.message).toBe('string');
    });

    test('should return blog', async () => {
      const blog = await Blog.create({
        user: user._id,
        name: blogData.name,
        description: blogData.description,
      });

      const res = await request(global.app).get(`/api/blogs/slug/${blog.slug}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blog');
      expect(res.body.blog._id).toBe(blog._id.toString());
      expect(res.body.blog.slug).toBe(blog.slug);
      expect(res.body.blog.name).toBe(blog.name);
      expect(res.body.blog.description).toBe(blog.description);
      expect(res.body.blog.user._id).toBe(user._id.toString());
      expect(res.body.blog.user.name).toBe(user.name);
      expect(res.body.blog.user.bio).toBe(user.bio);
    });
  });

  describe('GET /api/blogs/user/:userId', () => {
    test('should error when invalid user id', async () => {
      const res = await request(global.app).get('/api/blogs/user/123');

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('message');
    });

    test('should return user blogs', async () => {
      const blogs = [
        {
          user: user._id,
          name: 'Blog name #1',
        },
        {
          user: user._id,
          name: 'Blog name #2',
        },
      ];

      user = await User.findByIdAndUpdate(
        user._id,
        { avatar: { image_url: 'avatar_url' } },
        { new: true }
      );

      await Blog.create(blogs);

      const res = await request(global.app).get(`/api/blogs/user/${user._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('blogs');
      expect(res.body.blogs.length).toBe(2);

      const [blogOne, blogTwo] = res.body.blogs;

      expect(blogOne.user.name).toBe(user.name);
      expect(blogOne.user.bio).toBe(user.bio);
      expect(blogOne.user).toHaveProperty('avatar');
      expect(blogTwo.user.name).toBe(user.name);
      expect(blogTwo.user.bio).toBe(user.bio);
      expect(blogOne.user).toHaveProperty('avatar');
    });
  });

  describe('DELETE /api/blogs/:blogId', () => {
    test('should error when invalid blog ID', async () => {
      const res = await request(global.app)
        .delete('/api/blogs/123')
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('message');
    });

    test('should error when blog not found', async () => {
      const blogId = global.newId();
      const res = await request(global.app)
        .delete(`/api/blogs/${blogId}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('should error when user is not authorized to delete blog', async () => {
      const userId = global.newId();
      const blog = await Blog.create({ user: userId, name: blogData.name });

      const res = await request(global.app)
        .delete(`/api/blogs/${blog._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message');
    });

    test('should delete a blog with its posts', async () => {
      const blog = await Blog.create({ user: user._id, name: blogData.name });

      await Post.create({
        user: user._id,
        blog: blog._id,
        title: 'Post title',
        body: 'Post body',
      });

      const res = await request(global.app)
        .delete(`/api/blogs/${blog._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('blog');
      expect(res.body.blog.name).toBe(blog.name);
      expect(res.body.blog.slug).toBe(blog.slug);

      const postsLength = await Post.countDocuments({});
      expect(postsLength).toEqual(0);
    });
  });
});
