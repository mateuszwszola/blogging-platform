const jwt = require('jsonwebtoken');
const { User } = require('../../../src/models');
const {
  generateNewToken,
  verifyToken,
  auth,
} = require('../../../src/middleware/auth');

const dummyUser = require('../../../seeds/user.seed.json')[0];

describe('Authorization', () => {
  describe('generateNewToken', () => {
    test('should create new jwt token from user', () => {
      const id = global.newId().toString();
      const token = generateNewToken({ id });
      const payload = jwt.verify(token, process.env.JWT_KEY);

      expect(payload.user.id).toBe(id);
    });
  });

  describe('verifyToken', () => {
    test('should verify token and return payload with user id', async () => {
      const id = global.newId().toString();
      const token = generateNewToken({ id });
      const payload = await verifyToken(token);

      expect(payload.user.id).toBe(id);
    });
  });

  describe('auth', () => {
    test('should return error when no token provided', async () => {
      expect.assertions(3);

      const req = {
        header(prop) {
          if (prop === 'x-auth-token') {
            return null;
          }
          return undefined;
        },
      };

      const res = {
        status(status) {
          expect(status).toBe(401);
          return this;
        },
        json(result) {
          expect(result).toHaveProperty('message');
          expect(typeof result.message).toBe('string');
        },
      };

      const next = () => {};

      await auth.required(req, res, next);
    });

    test('should return error when invalid token provided', async () => {
      expect.assertions(3);

      const req = {
        header(prop) {
          if (prop === 'x-auth-token') {
            return 123;
          }
          return undefined;
        },
      };

      const res = {
        status(status) {
          expect(status).toBe(401);
          return this;
        },
        json(result) {
          expect(result).toHaveProperty('message');
          expect(typeof result.message).toBe('string');
        },
      };

      const next = () => {};

      await auth.required(req, res, next);
    });

    test('should return error when user from payload does not exists', async () => {
      expect.assertions(3);

      const token = generateNewToken({ id: global.newId() });

      const req = {
        header(prop) {
          if (prop === 'x-auth-token') {
            return token;
          }
          return undefined;
        },
      };

      const res = {
        status(status) {
          expect(status).toBe(401);
          return this;
        },
        json(result) {
          expect(result).toHaveProperty('message');
          expect(typeof result.message).toBe('string');
        },
      };

      const next = () => {};

      await auth.required(req, res, next);
    });

    test('should set user and token on request object and call next', async () => {
      expect.assertions(5);

      const user = await User.create(dummyUser);
      const token = generateNewToken(user);

      const req = {
        header(prop) {
          if (prop === 'x-auth-token') {
            return token;
          }
          return undefined;
        },
      };

      const res = {};

      const next = () => {
        expect(true).toBe(true);
      };

      await auth.required(req, res, next);

      expect(req).toHaveProperty('user');
      expect(req).toHaveProperty('token');
      expect(req.token).toBe(token);

      expect(req.user._id.toString()).toBe(user._id.toString());
    });
  });
});
