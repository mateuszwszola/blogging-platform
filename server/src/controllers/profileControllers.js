const { User } = require('../models');
const { ErrorHandler } = require('../utils/error');

exports.getProfiles = async (req, res) => {
  const { cursor = 0, limit = 10 } = req.query;

  const users = await User.find({})
    .limit(limit * 1)
    .skip(cursor * 1)
    .exec();

  const count = await User.countDocuments();

  return res.json({
    profiles: users.map((user) => user.toProfileJSONFor(req.user || null)),
    hasMore: cursor + users.length < count,
    totalDocs: count,
    currentCursor: cursor,
  });
};

exports.getUserProfileById = async (req, res) => {
  return res.json({ profile: req.profile.toProfileJSONFor(req.user || null) });
};

exports.getFollowing = async (req, res) => {
  const { cursor = 0, limit = 10 } = req.query;

  const users = await User.find({})
    .limit(limit * 1)
    .skip(cursor * 1)
    .where('_id')
    .in(req.profile.following)
    .exec();

  const count = await User.countDocuments();

  return res.json({
    profiles: users.map((user) => user.toProfileJSONFor(req.user)),
    hasMore: cursor + users.length < count,
    totalDocs: count,
    currentCursor: cursor,
  });
};

exports.follow = async (req, res) => {
  const userId = req.user._id;
  const profileId = req.profile._id;

  const user = await User.findById(userId);

  if (userId.toString() === profileId.toString()) {
    throw new ErrorHandler(400, 'You cannot follow your own profile');
  }

  await user.follow(profileId);

  return res.json({ profile: req.profile.toProfileJSONFor(user) });
};

exports.unfollow = async (req, res) => {
  const userId = req.user._id;
  const profileId = req.profile._id;

  const user = await User.findById(userId);

  if (userId.toString() === profileId.toString()) {
    throw new ErrorHandler(400, 'You cannot follow your own profile');
  }

  await user.unfollow(profileId);

  return res.json({ profile: req.profile.toProfileJSONFor(user) });
};
