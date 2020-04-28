const Jimp = require('jimp');

async function convertBufferToJimpImg(buffer) {
  return await Jimp.read(buffer);
}

async function resizeAndOptimizeImg(image, width, height = Jimp.AUTO, quality) {
  await image.resize(width, height);
  await image.quality(quality);
  return await image.getBufferAsync('image/jpeg');
}

module.exports = {
  convertBufferToJimpImg,
  resizeAndOptimizeImg,
};
