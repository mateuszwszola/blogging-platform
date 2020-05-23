export default function validate(values) {
  let errors = {};
  if (!values.name) {
    errors.name = 'name is required';
  }
  if (!values.description) {
    errors.description = 'description is required';
  }
  return errors;
}
