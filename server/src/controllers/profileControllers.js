const User = require('../models/User');
const { ErrorHandler } = require('../utils/error');

exports.getUserProfileById = async (req, res, next) => {
  try {
    res.json({ profile: req.profile.toProfileJSONFor(null) });
  } catch (err) {
    next(err);
  }
};

exports.follow = async (req, res, next) => {
  const userId = req.user._id;
  const profileId = req.profile._id;

  try {
    const user = await User.findById(userId);

    if (userId.toString() === profileId.toString()) {
      throw new ErrorHandler(400, 'You cannot follow your own profile');
    }

    await user.follow(profileId);

    res.json({ profile: req.profile.toProfileJSONFor(user) });
  } catch (err) {
    next(err);
  }
};

exports.unfollow = async (req, res, next) => {
  const userId = req.user._id;
  const profileId = req.profile._id;

  try {
    const user = await User.findById(userId);

    await user.unfollow(profileId);

    res.json({ profile: req.profile.toProfileJSONFor(user) });
  } catch (err) {
    next(err);
  }
};
