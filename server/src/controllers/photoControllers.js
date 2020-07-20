const Photo = require('../models/Photo');

// TODO: upload obrazków do bazy danych? To jest taki anty-pattern. Masz S3 więc może to tutaj to tylko legacy code?
exports.uploadPhoto = async (req, res, next) => {
  try {
    const photo = new Photo(req.body);
    const file = req.file.buffer;
    photo.photo = file;

    await photo.save();
    res.status(200).json({ _id: photo._id });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getPhotos = async (req, res, next) => {
  try {
    // TODO: wszystkie obrazki które masz w bazie? To taki słaby pomysł. Zawsze powinna być jakaś paginacja
    const photos = await Photo.find({});
    res.json({ photos });
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};

exports.getPhoto = async (req, res, next) => {
  try {
    const result = await Photo.findById(req.params.id);
    res.set('Content-Type', 'image/jpeg');
    res.send(result.photo);
  } catch (err) {
    res.status(err.status || 400);
    next(err);
  }
};
