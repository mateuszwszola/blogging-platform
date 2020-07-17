class AuthService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async Signup(userData) {
    const user = await this.userModel.create(userData);
    const token = await user.generateAuthToken();

    return {
      user,
      token,
    };
  }

  async Signin(credentials) {
    const { email, password } = credentials;

    const user = await this.userModel.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    return {
      user,
      token,
    };
  }

  async ChangePassword(email, currentPassword, newPassword) {
    const user = await this.userModel.findByCredentials(email, currentPassword);

    user.password = newPassword;
    await user.save();
  }
}

module.exports = AuthService;
