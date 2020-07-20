const User = require('../models/User');
const { ErrorHandler } = require('../utils/error');

// TODO: Zamiast wszędzie dodawać try {} catch { next(err) } sugeruję dodać moduł express-async-errors

exports.getProfiles = async (req, res, next) => {
  try {
    // TODO: zawsze powinieneś implementować paginację dla takich przypadków. Choćby i ustawioną na jakąś wysoką ilość
    //  defaultowo w stylu 100
    const users = await User.find({});

    // TODO: DRY
    //  mógłbyś zrobić niby req.user || null, ale po co
    return res.json({
      profiles: users.map((user) => user.toProfileJSONFor(req.user)),
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserProfileById = async (req, res, next) => {
  try {
    return res.json({ profile: req.profile.toProfileJSONFor(req.user) });
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

    return res.json({
      profiles: users.map((user) => user.toProfileJSONFor(req.user)),
    });
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
