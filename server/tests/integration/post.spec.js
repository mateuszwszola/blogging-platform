const request = require('supertest');
const sinon = require('sinon');
const { User, Blog, Post } = require('../../src/models');
const { testValidationResults } = require('../../src/utils/testsHelpers');
const dummyUsers = require('../../seeds/user.seed.json');
const dummyBlogs = require('../../seeds/blog.seed.json');
const dummyPosts = require('../../seeds/post.seed.json');

const { uploader } = require('../../src/services/cloudinary');

sinon.stub(uploader, 'upload').callsFake(() => {
  return new Promise((resolve) => {
    return resolve({
      secure_url: 'image-url',
      eager: [{ secure_url: 'large-image-url' }],
    });
  });
});

describe('Post API tests', () => {
  let user;
  let token;
  beforeEach(async () => {
    user = await User.create({ ...dummyUsers[0] });
    token = user.generateAuthToken();
  });

  describe('POST api/posts/:blogId', () => {
    test('returns 401 if no token provided', async () => {
      const blogId = global.newId();
      const res = await request(global.app).post(`/api/posts/${blogId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    test('returns 422 if invalid blog ID', async () => {
      const res = await request(global.app)
        .post('/api/posts/123')
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('message');
    });

    test('returns 422 if no required fields provided', async () => {
      const blogId = global.newId();

      const res = await request(global.app)
        .post(`/api/posts/${blogId}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toHaveProperty('title');
      expect(res.body.errors).toHaveProperty('body');
    });

    test('returns error if invalid title length', async () => {
      const blogId = global.newId();

      const res = await request(global.app)
        .post(`/api/posts/${blogId}`)
        .set('x-auth-token', token)
        .send({ title: 'T' });

      expect.assertions(3);
      testValidationResults(expect, res, 'title');
    });

    test('returns error if bgImgUrl is invalid url', async () => {
      const blogId = global.newId();

      const res = await request(global.app)
        .post(`/api/posts/${blogId}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0], bgImgUrl: 'bg-img-url' });

      testValidationResults(expect, res, 'bgImgUrl');
      expect(res.body.errors.bgImgUrl.toLowerCase()).toMatch(/url/);
    });

    test('returns error if invalid imgAttribution length', async () => {
      const blogId = global.newId();

      const res = await request(global.app)
        .post(`/api/posts/${blogId}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0], imgAttribution: 'I' });

      testValidationResults(expect, res, 'imgAttribution');
      expect(res.body.errors.imgAttribution.toLowerCase()).toMatch(/char/);
    });

    test('returns 404 if blog not found', async () => {
      const blogId = global.newId();

      const res = await request(global.app)
        .post(`/api/posts/${blogId}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0] });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('returns error if user is not authorized to create a post', async () => {
      const userId = global.newId();

      const blog = await Blog.create({
        user: userId,
        name: dummyBlogs[0].name,
      });

      const res = await request(global.app)
        .post(`/api/posts/${blog._id}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0] });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message');
    });

    test('creates a post', async () => {
      const blog = await Blog.create({
        user: user._id,
        name: dummyBlogs[0].name,
      });

      const postData = {
        ...dummyPosts[0],
        tags: 'tag1,tag2',
      };

      const res = await request(global.app)
        .post(`/api/posts/${blog._id}`)
        .set('x-auth-token', token)
        .send({ ...postData });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('post');
      expect(res.body.post).toHaveProperty('slug');
      expect(res.body.post).toHaveProperty('favorited');
      expect(res.body.post.blog).toBe(blog._id.toString());
      expect(res.body.post.user).toBe(user._id.toString());
      expect(res.body.post.title).toBe(postData.title);
      expect(res.body.post.body).toBe(postData.body);
      expect(res.body.post.tags.length).toBe(2);
      expect(res.body.post.bgImg).toHaveProperty('image_url');
      expect(res.body.post.bgImg).toHaveProperty('large_image_url');
      expect(res.body.post.bgImg).toHaveProperty('img_attribution');
    });

    test('creates post with uploaded photo', async () => {
      const blog = await Blog.create({ user: user._id, name: 'Blog name' });

      const { title, body, imgAttribution } = dummyPosts[0];

      const res = await request(global.app)
        .post(`/api/posts/${blog._id}`)
        .set('x-auth-token', token)
        .field('title', title)
        .field('body', body)
        .field('imgAttribution', imgAttribution)
        .attach('photo', 'fixtures/background.png');

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('post');
      expect(res.body.post.title).toBe(title);
      expect(res.body.post.body).toBe(body);
      expect(res.body.post.bgImg).toHaveProperty('image_url');
      expect(res.body.post.bgImg).toHaveProperty('large_image_url');
      expect(res.body.post.bgImg.img_attribution).toBe(imgAttribution);
    });
  });

  describe('PUT api/posts/:postId', () => {
    let post;
    beforeEach(async () => {
      post = await Post.create({ title: 'Post title', body: 'Post body' });
    });

    test('returns 401 error if no token provided', async () => {
      const res = await request(global.app).put(`/api/posts/${post._id}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    test('returns error if invalid post ID', async () => {
      const res = await request(global.app)
        .put('/api/posts/123')
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('message');
    });

    test('returns error if no required fields provided', async () => {
      const res = await request(global.app)
        .put(`/api/posts/${post._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('errors');
      expect(res.body.errors).toHaveProperty('title');
      expect(res.body.errors).toHaveProperty('body');
    });

    test('returns error if invalid title length', async () => {
      const res = await request(global.app)
        .put(`/api/posts/${post._id}`)
        .set('x-auth-token', token)
        .send({ title: 'T' });

      expect.assertions(3);
      testValidationResults(expect, res, 'title');
    });

    test('returns error if bgImgUrl is invalid url', async () => {
      const res = await request(global.app)
        .put(`/api/posts/${post._id}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0], bgImgUrl: 'bg-img-url' });

      expect(res.body.errors.bgImgUrl.toLowerCase()).toMatch(/url/);
    });

    test('returns error if invalid imgAttribution length', async () => {
      const postId = global.newId();
      const res = await request(global.app)
        .put(`/api/posts/${postId}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0], imgAttribution: 'I' });

      testValidationResults(expect, res, 'imgAttribution');
      expect(res.body.errors.imgAttribution.toLowerCase()).toMatch(/char/);
    });

    test('returns 404 error if post not found', async () => {
      const postId = global.newId();
      const res = await request(global.app)
        .put(`/api/posts/${postId}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[0] });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('returns error if user is not the owner of the post', async () => {
      const userId = global.newId();
      const blog = await Blog.create({ user: user._id, ...dummyBlogs[0] });
      const post = await Post.create({
        user: userId,
        blog: blog._id,
        title: 'Post title',
        body: 'Post body',
      });

      const res = await request(global.app)
        .put(`/api/posts/${post._id}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[1] });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message');
    });

    test('updates a post', async () => {
      const blog = await Blog.create({
        user: user._id,
        name: dummyBlogs[0].name,
      });

      const post = await Post.create({
        user: user._id,
        blog: blog._id,
        title: dummyPosts[0].title,
        body: dummyPosts[0].body,
      });

      const res = await request(global.app)
        .put(`/api/posts/${post._id}`)
        .set('x-auth-token', token)
        .send({ ...dummyPosts[1] });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('post');
      expect(res.body.post._id).toBe(post._id.toString());
      expect(res.body.post.user).toBe(user._id.toString());
      expect(res.body.post.slug).toBe(post.slug);
      expect(res.body.post.title).toBe(dummyPosts[1].title);
      expect(res.body.post.body).toBe(dummyPosts[1].body);
      expect(res.body.post.bgImg).toHaveProperty('image_url');
      expect(res.body.post.bgImg).toHaveProperty('large_image_url');
      expect(res.body.post.bgImg.img_attribution).toBe(
        dummyPosts[1].imgAttribution
      );
    });

    test('updates a post with uploaded photo', async () => {
      const blog = await Blog.create({
        user: user._id,
        name: dummyBlogs[0].name,
      });

      const post = await Post.create({
        user: user._id,
        blog: blog._id,
        title: dummyPosts[0].title,
        body: dummyPosts[0].body,
      });

      const { title, body } = dummyPosts[0];

      const res = await request(global.app)
        .put(`/api/posts/${post._id}`)
        .set('x-auth-token', token)
        .field('title', title)
        .field('body', body)
        .attach('photo', 'fixtures/background.png');

      expect(res.statusCode).toBe(200);
      expect(res.body.post.title).toBe(title);
      expect(res.body.post.body).toBe(body);
      expect(res.body.post.bgImg).toHaveProperty('image_url');
      expect(res.body.post.bgImg).toHaveProperty('large_image_url');
    });
  });

  describe('DELETE api/posts/:postId', () => {
    test('returns error if invalid post ID', async () => {
      const res = await request(global.app)
        .delete(`/api/posts/123`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('message');
    });

    test('returns error if post not found', async () => {
      const postId = global.newId();
      const res = await request(global.app)
        .delete(`/api/posts/${postId}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('returns error if user is not the owner of the post', async () => {
      const userId = global.newId();
      const post = await Post.create({
        user: userId,
        title: dummyPosts[0].title,
        body: dummyPosts[0].body,
      });

      const res = await request(global.app)
        .delete(`/api/posts/${post._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message');
    });

    test('deletes a post', async () => {
      const post = await Post.create({
        user: user._id,
        title: dummyPosts[0].title,
        body: dummyPosts[0].body,
      });

      const res = await request(global.app)
        .delete(`/api/posts/${post._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('post');
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('posts', () => {
    let user2;
    let blogs;
    let posts;
    beforeEach(async () => {
      user2 = await User.create({ ...dummyUsers[1] });
      const blogsData = [
        { user: user._id, name: dummyBlogs[0].name },
        { user: user2._id, name: dummyBlogs[1].name },
      ];
      blogs = await Blog.create(blogsData);
      const postsData = [
        {
          user: user._id,
          blog: blogs[0]._id,
          title: dummyPosts[0].title,
          body: dummyPosts[0].body,
        },
        {
          user: user2._id,
          blog: blogs[1]._id,
          title: dummyPosts[1].title,
          body: dummyPosts[1].body,
        },
      ];
      posts = await Post.create(postsData);
    });

    describe('GET api/posts/all', () => {
      test('returns all posts with populated data', async () => {
        const res = await request(global.app).get('/api/posts/all');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('posts');
        expect(res.body.posts.length).toBe(2);

        const testedPost = res.body.posts[0];
        // test if post contains populated data
        expect(testedPost.user).toHaveProperty('name');
        expect(testedPost.user).toHaveProperty('bio');
        expect(testedPost.blog).toHaveProperty('name');
        expect(testedPost.blog).toHaveProperty('slug');
      });
    });

    describe('GET api/posts', () => {
      test('returns 401 if no token provided', async () => {
        const res = await request(global.app).get('/api/posts');

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
      });

      test('returns user posts', async () => {
        const res = await request(global.app)
          .get('/api/posts')
          .set('x-auth-token', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('posts');
        expect(res.body.posts.length).toBe(1);
      });
    });

    describe('GET api/posts/user/:userId', () => {
      test('returns 422 if invalid user ID', async () => {
        const res = await request(global.app).get('/api/posts/user/123');

        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty('message');
      });

      test('returns 404 if user does not exists', async () => {
        const userId = global.newId();

        const res = await request(global.app).get(`/api/posts/user/${userId}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message');
      });

      test('returns user posts', async () => {
        const res = await request(global.app).get(
          `/api/posts/user/${user._id}`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('posts');
        expect(res.body.posts.length).toBe(1);
      });
    });

    describe('GET api/posts/blog/:blogId', () => {
      test('returns 422 if invalid blog ID', async () => {
        const res = await request(global.app).get('/api/posts/blog/123');

        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty('message');
      });

      test('returns 404 if blog does not exists', async () => {
        const blogId = global.newId();

        const res = await request(global.app).get(`/api/posts/blog/${blogId}`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message');
      });

      test('returns blog posts', async () => {
        const res = await request(global.app).get(
          `/api/posts/blog/${blogs[0]._id}`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('posts');
        expect(res.body.posts.length).toBe(1);
      });
    });

    describe('GET api/posts/user/:userId/favorites', () => {
      test('returns 404 if user does not exists', async () => {
        const userId = global.newId();

        const res = await request(global.app).get(
          `/api/posts/user/${userId}/favorites`
        );

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message');
      });

      test('returns user favorite posts', async () => {
        const postId = posts[0]._id;
        await user.favorite(postId);

        const res = await request(global.app).get(
          `/api/posts/user/${user._id}/favorites`
        );

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('posts');
        expect(res.body.posts.length).toBe(1);
        expect(res.body.posts[0]._id).toBe(postId.toString());
        expect(res.body.posts[0].user._id).toBe(user._id.toString());
      });
    });

    describe('GET api/posts/slug/:slug', () => {
      test('returns 404 if post does not exists', async () => {
        const res = await request(global.app).get(`/api/posts/slug/slug`);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message');
      });

      test('returns post', async () => {
        const slug = posts[1].slug;

        const res = await request(global.app).get(`/api/posts/slug/${slug}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('post');
      });
    });

    describe('POST api/posts/:slug/favorite', () => {
      test('returns 404 if post does not exists', async () => {
        const res = await request(global.app)
          .post(`/api/posts/slug/favorite`)
          .set('x-auth-token', token);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message');
      });

      test('returns 401 if user is not authorized', async () => {
        const slug = posts[1].slug;

        const res = await request(global.app).post(
          `/api/posts/${slug}/favorite`
        );

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
      });

      test('favorites a post', async () => {
        const slug = posts[1].slug;

        const res = await request(global.app)
          .post(`/api/posts/${slug}/favorite`)
          .set('x-auth-token', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('post');
        expect(res.body.post).toHaveProperty('favoritesCount');
        expect(res.body.post).toHaveProperty('favorited');
        expect(res.body.post.favoritesCount).toBe(1);
        expect(res.body.post.favorited).toBe(true);
      });
    });

    describe('DELETE api/posts/:slug/favorite', () => {
      test('returns 404 if post does not exists', async () => {
        const res = await request(global.app)
          .delete(`/api/posts/slug/favorite`)
          .set('x-auth-token', token);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message');
      });

      test('returns 401 if user is not authorized', async () => {
        const slug = posts[0].slug;

        const res = await request(global.app).delete(
          `/api/posts/${slug}/favorite`
        );

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message');
      });

      test('unfavorites a post', async () => {
        const slug = posts[1].slug;

        await request(global.app)
          .post(`/api/posts/${slug}/favorite`)
          .set('x-auth-token', token);

        const res = await request(global.app)
          .delete(`/api/posts/${slug}/favorite`)
          .set('x-auth-token', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('post');
        expect(res.body.post).toHaveProperty('favoritesCount');
        expect(res.body.post).toHaveProperty('favorited');
        expect(res.body.post.favoritesCount).toBe(0);
        expect(res.body.post.favorited).toBe(false);
      });
    });
  });
});
