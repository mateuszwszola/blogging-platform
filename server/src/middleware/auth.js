const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_KEY, JWT_EXP } = process.env;

const generateNewToken = (user) => {
  return jwt.sign({ user: { id: user.id } }, JWT_KEY, {
    expiresIn: JWT_EXP || 3600,
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_KEY, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
};

const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  const errMsg = 'Not authorized to access this resource';

  if (!token) {
    return res.status(401).json({ message: errMsg });
  }

  try {
    const data = await verifyToken(token);
    const user = await User.findOne({ _id: data.user.id }).select('-password');
    if (!user) {
      return res.status(401).json({ message: errMsg });
    }
    req.user = user;
    req.token = token;
  } catch (err) {
    return res.status(401).json({ message: errMsg });
  }

  next();
};

module.exports = {
  auth,
  generateNewToken,
  verifyToken,
};
