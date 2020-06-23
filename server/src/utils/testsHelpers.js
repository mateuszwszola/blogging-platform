const mongoose = require('mongoose');

exports.checkForValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

exports.testValidationResults = (expect, res, field) => {
  expect(res.statusCode).toBe(422);
  expect(res.body).toHaveProperty('errors');
  expect(res.body.errors).toHaveProperty(field);
  expect(typeof res.body.errors[field]).toBe('string');
};
