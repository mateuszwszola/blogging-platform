const { User } = require('../models');
const { ErrorHandler } = require('../utils/error');

exports.getProfiles = async (req, res) => {
  const { cursor: cursorQuery = 0, limit: limitQuery = 10 } = req.query;
  const [cursor, limit] = [+cursorQuery, +limitQuery];

  const [users, count] = await Promise.all([
    User.find({}).limit(limit).skip(cursor).exec(),
    User.countDocuments(),
  ]);

  return res.json({
    profiles: users.map((user) => user.toProfileJSONFor(req.user || null)),
    ...(cursor + users.length < count
      ? { nextCursor: cursor + users.length }
      : null),
  });
};

exports.getUserProfileById = async (req, res) => {
  return res.json({ profile: req.profile.toProfileJSONFor(req.user || null) });
};

exports.getFollowing = async (req, res) => {
  const { cursor: cursorQuery = 0, limit: limitQuery = 10 } = req.query;
  const [cursor, limit] = [+cursorQuery, +limitQuery];

  const usersQuery = User.find({})
    .limit(limit)
    .skip(cursor)
    .where('_id')
    .in(req.profile.following);

  const [users, count] = await Promise.all([
    usersQuery.exec(),
    User.countDocuments().exec(),
  ]);

  return res.json({
    profiles: users.map((user) => user.toProfileJSONFor(req.user)),
    ...(cursor + users.length < count
      ? { nextCursor: cursor + users.length }
      : null),
  });
};

exports.follow = async (req, res) => {
  const { _id: userId } = req.user;
  const { _id: profileId } = req.profile;

  const user = await User.findById(userId);

  if (userId.toString() === profileId.toString()) {
    throw new ErrorHandler(400, 'You cannot follow your own profile');
  }

  await user.follow(profileId);

  return res.json({ profile: req.profile.toProfileJSONFor(user) });
};

exports.unfollow = async (req, res) => {
  const { _id: userId } = req.user;
  const { _id: profileId } = req.profile;

  const user = await User.findById(userId);

  if (userId.toString() === profileId.toString()) {
    throw new ErrorHandler(400, 'You cannot follow your own profile');
  }

  await user.unfollow(profileId);

  return res.json({ profile: req.profile.toProfileJSONFor(user) });
};
