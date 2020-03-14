export default function validate(values) {
  let errors = {};
  if (!values.title) {
    errors.title = 'title is required';
  }
  if (!values.body) {
    errors.body = 'body is required';
  }
  return errors;
}
