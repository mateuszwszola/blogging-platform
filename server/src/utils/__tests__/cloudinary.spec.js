const { getPublicIdFromImageUrl } = require('../cloudinary');

describe('getPublicIdFromImageUrl', () => {
  test('returns empty string if imageUrl is empty string', () => {
    expect(getPublicIdFromImageUrl('')).toBe('');
  });

  test('returns public ID', () => {
    const imageUrl =
      'https://res.cloudinary.com/demo/image/upload/v1570979583/grand_canyon.jpg';
    expect(getPublicIdFromImageUrl(imageUrl)).toBe('grand_canyon');
  });
});
