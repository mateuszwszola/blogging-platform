const { uploader } = require('../services/cloudinary');

function getPublicIdFromImageUrl(imageUrl) {
  return imageUrl.split('/').pop().split('.')[0];
}

function deleteAssetFromCloudinary(asset) {
  return new Promise((resolve, reject) => {
    uploader.destroy(asset, (error, result) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(result);
      }
    });
  });
}

async function deleteImageFromCloudinary(imageUrl, uploadPreset = '') {
  const publicId = getPublicIdFromImageUrl(imageUrl);
  const asset = uploadPreset ? `${uploadPreset}/${publicId}` : publicId;
  return deleteAssetFromCloudinary(asset);
}

module.exports = {
  getPublicIdFromImageUrl,
  deleteImageFromCloudinary,
};
