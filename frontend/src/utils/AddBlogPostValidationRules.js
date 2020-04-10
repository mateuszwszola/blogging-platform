export default function validate(values) {
  let errors = {};
  if (!values.title) {
    errors.title = 'title is required';
  }
  return errors;
}
