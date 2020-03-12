const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  const errMsg = 'Not authorized to access this resource';

  if (!token) {
    res.status(401);
    const err = new Error(errMsg);
    return next(err);
  }

  try {
    const data = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findOne({ _id: data.user.id }).select('-password');
    if (!user) {
      throw new Error(errMsg);
    }
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401);
    next(err);
  }
};

module.exports = auth;
