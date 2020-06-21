function getObjectKeyFromImageUrl(imageURL) {
  const parts = imageURL.split('/');
  return parts[parts.length - 1];
}

module.exports = getObjectKeyFromImageUrl;
