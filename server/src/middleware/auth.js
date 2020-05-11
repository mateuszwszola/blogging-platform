const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateNewToken = (user) => {
  return jwt.sign({ user: { id: user.id } }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXP || 3600,
  });
};

const verifyToken = (token, secret = process.env.JWT_KEY) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
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
    const user = await User.findById(data.user.id).select('-password').lean();
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
