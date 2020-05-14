function testValidationResults(expect, res, field) {
  expect(res.statusCode).toBe(422);
  expect(res.body).toHaveProperty('errors');
  expect(res.body.errors).toHaveProperty(field);
  expect(typeof res.body.errors[field]).toBe('string');
}

module.exports = {
  testValidationResults,
};
