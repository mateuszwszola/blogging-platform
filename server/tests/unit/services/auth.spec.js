const AuthService = require('../../../src/services/auth');

describe('Auth service unit tests', () => {
  describe('Signup', () => {
    test('Should create user record and token', async () => {
      const userModel = {
        create: (user) => {
          return {
            ...user,
            _id: 'mock-user-id',
            generateAuthToken: () => 'auth-token',
          };
        },
      };

      const userData = {
        name: 'User name',
        email: 'test@test.com',
        password: 'password123',
      };

      const authService = new AuthService(userModel);
      const result = await authService.Signup(userData);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user._id).toBeDefined();
    });
  });
});
