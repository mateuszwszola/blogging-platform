const request = require('supertest');
const { User, Post, Comment } = require('../../src/models');
const dummyUser = require('../../seeds/user.seed.json')[0];
const { app } = require('../../src/app');

describe('Comment API tests', () => {
  let user;
  let token;
  let post;

  beforeEach(async () => {
    user = await User.create(dummyUser);
    token = user.generateAuthToken();
    const blogId = global.newId();
    post = await Post.create({
      user: user._id,
      blog: blogId,
      title: 'Post title',
      body: 'Post body',
    });
  });

  describe('POST api/comments/:postId', () => {
    test('returns 401 if no token provided', async () => {
      const res = await request(app)
        .post(`/api/comments/${post._id}`)
        .send({ body: 'Comment body' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    test('returns 422 if invalid post ID', async () => {
      const res = await request(app)
        .post(`/api/comments/123`)
        .set('x-auth-token', token)
        .send({ body: 'Comment body' });

      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('message');
    });

    test('returns 422 if no comment body provided ', async () => {
      const res = await request(app)
        .post(`/api/comments/${post._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(422);
      expect(res.body.errors).toHaveProperty('body');
    });

    test('returns 404 if post not found ', async () => {
      const res = await request(app)
        .post(`/api/comments/${global.newId()}`)
        .set('x-auth-token', token)
        .send({ body: 'Comment body' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('adds a comment', async () => {
      const res = await request(app)
        .post(`/api/comments/${post._id}`)
        .set('x-auth-token', token)
        .send({ body: 'Comment body' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('comment');
      expect(res.body.comment.body).toBe('Comment body');
      expect(res.body.comment.user).toBe(user._id.toString());
      expect(res.body.comment.post).toBe(post._id.toString());

      const doc = await Post.findById(post._id);
      expect(doc.comments.length).toBe(1);
    });
  });

  describe('DELETE api/comments/:commentId', () => {
    test('returns 401 if no token provided', async () => {
      const comment = await Comment.create({
        user: user._id,
        post: post._id,
        body: 'Comment body',
      });

      const res = await request(app).delete(`/api/comments/${comment._id}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    test('returns 403 if user is not authorized to delete comment', async () => {
      const comment = await Comment.create({
        user: global.newId(),
        post: post._id,
        body: 'Comment body',
      });

      const res = await request(app)
        .delete(`/api/comments/${comment._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty('message');
    });

    test('returns 404 if comment not found', async () => {
      const res = await request(app)
        .delete(`/api/comments/${global.newId()}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('deletes comment', async () => {
      const comment = await Comment.create({
        user: user._id,
        post: post._id,
        body: 'Comment body',
      });

      const res = await request(app)
        .delete(`/api/comments/${comment._id}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET api/comments/:postId', () => {
    test('returns 404 if post not found', async () => {
      const res = await request(app).get(`/api/comments/${global.newId()}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    test('returns comments', async () => {
      const comments = [
        {
          user: user._id,
          post: post._id,
          body: 'Comment body #1',
        },
        {
          user: user._id,
          post: post._id,
          body: 'Comment body #2',
        },
      ];

      await Comment.create(comments);

      const res = await request(app).get(`/api/comments/${post._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('comments');
      expect(res.body.comments.length).toBe(2);
      expect(res.body.comments[0]).toHaveProperty('user');
      expect(res.body.comments[0].user).toHaveProperty('name');
    });
  });
});
