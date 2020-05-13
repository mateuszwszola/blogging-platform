const config = require('../config');

module.exports = (photoId) => `${config.apiUrl}/photos/${photoId}`;
