const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const generateNewToken = (user) => {
  return jwt.sign({ user: { id: user.id } }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

const verifyToken = (token, secret = config.secrets.jwt) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
};

const auth = {
  required: async (req, res, next) => {
    const token = req.header('x-auth-token');
    const errMsg = 'Not authorized to access this resource';
    if (!token) {
      return res.status(401).json({ message: errMsg });
    }
    try {
      const data = await verifyToken(token);
      const user = await User.findById(data.user.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: errMsg });
      }
      req.user = user;
      req.token = token;
    } catch (err) {
      return res.status(401).json({ message: errMsg });
    }

    next();
  },
  optional: async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (token) {
      const data = await verifyToken(token);
      if (data) {
        const user = await User.findById(data.user.id).select('-password');
        if (user) {
          req.user = user;
        }
      }
    }

    next();
  },
};

module.exports = {
  auth,
  generateNewToken,
  verifyToken,
};
