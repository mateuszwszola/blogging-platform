const specifiedStringLength = (field, minlength, maxlength) => {
  const obj = {};
  if (minlength) {
    obj.minlength = [
      minlength,
      `${field} must have min ${minlength} characters`,
    ];
  }
  if (maxlength) {
    obj.maxlength = [
      maxlength,
      `${field} must have max ${maxlength} characters`,
    ];
  }
  return obj;
};

module.exports = specifiedStringLength;
