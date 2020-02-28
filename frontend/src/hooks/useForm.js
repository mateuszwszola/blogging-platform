import { useState, useEffect } from 'react';

export function useForm(initialValues = {}, callback, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
  }, [errors]);

  function handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    setErrors(validate(values));
  }

  function handleChange(event) {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  }

  function handleReset() {
    setValues(initialValues);
  }

  return {
    handleChange,
    handleSubmit,
    handleReset,
    values,
    errors,
    setErrors
  };
}
