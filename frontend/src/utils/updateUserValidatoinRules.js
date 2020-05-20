function validate(values) {
  const errors = {};
  if (!values.name) {
    errors.name = 'name is required';
  }
  return errors;
}

export default validate;
