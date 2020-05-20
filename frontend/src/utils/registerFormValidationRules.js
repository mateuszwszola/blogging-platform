export default function validate(values) {
  let errors = {};
  if (!values.name) {
    errors.name = 'name is required';
  }
  if (!values.email) {
    errors.email = 'email address is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'email address is invalid';
  }
  if (!values.password) {
    errors.password = 'password is required';
  }
  if (!values.password2) {
    errors.password2 = 'confirm password is required';
  }
  if (values.password !== values.password2) {
    errors.password = 'password must match';
    errors.password2 = 'password must match';
  }
  return errors;
}
