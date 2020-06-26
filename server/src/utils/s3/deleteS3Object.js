const { s3 } = require('../../config/services/s3');

function deleteS3Object(objectKey) {
  const params = {
    Bucket: 'blogging-platform-storage',
    Key: objectKey,
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = deleteS3Object;
