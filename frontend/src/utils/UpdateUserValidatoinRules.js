function validate(values) {
  const errors = {};
  if (!values.name) {
    errors.name = 'name is required';
  }
  if (!values.bio) {
    errors.bio = 'bio is required';
  }
  return errors;
}

export default validate;
