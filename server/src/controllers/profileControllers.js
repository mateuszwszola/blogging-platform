const User = require('../models/User');
const { ErrorHandler } = require('../utils/error');

exports.getProfiles = async (req, res, next) => {
  try {
    const users = await User.find({});

    if (req.user) {
      return res.json({
        profiles: users.map((user) => user.toProfileJSONFor(req.user)),
      });
    } else {
      return res.json({
        profiles: users.map((user) => user.toProfileJSONFor(null)),
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.getUserProfileById = async (req, res, next) => {
  try {
    if (req.user) {
      return res.json({ profile: req.profile.toProfileJSONFor(req.user) });
    } else {
      return res.json({ profile: req.profile.toProfileJSONFor(null) });
    }
  } catch (err) {
    next(err);
  }
};

exports.getFollowing = async (req, res, next) => {
  try {
    const users = await User.find({})
      .where('_id')
      .in(req.profile.following)
      .exec();

    if (req.user) {
      return res.json({
        profiles: users.map((user) => user.toProfileJSONFor(req.user)),
      });
    } else {
      return res.json({
        profiles: users.map((user) => user.toProfileJSONFor(null)),
      });
    }
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

    if (userId.toString() === profileId.toString()) {
      throw new ErrorHandler(400, 'You cannot follow your own profile');
    }

    await user.unfollow(profileId);

    res.json({ profile: req.profile.toProfileJSONFor(user) });
  } catch (err) {
    next(err);
  }
};
