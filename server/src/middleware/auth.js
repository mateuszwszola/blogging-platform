const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const generateNewToken = (user) => {
  return jwt.sign({ user: { id: user.id } }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      return resolve(payload);
    });
  });
};

const auth = {
  required: async (req, res, next) => {
    const errMsg = 'Not authorized to access this resource';
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: errMsg });
    }

    try {
      const payload = await verifyToken(token);
      const user = await User.findById(payload.user.id)
        .select('-password')
        .exec();

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

    if (!token) {
      return next();
    }

    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err || !payload) {
        return next();
      }

      User.findById(payload.user.id)
        .select('-password')
        .exec()
        .then((user) => {
          if (user) {
            req.user = user;
          }
          return next();
        });
    });
  },
};

module.exports = {
  auth,
  generateNewToken,
  verifyToken,
};
