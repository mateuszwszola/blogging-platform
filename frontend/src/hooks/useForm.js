import { useState } from 'react';

export function useForm(initialValues = {}, callback) {
  const [values, setValues] = useState(initialValues);

  function handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    callback();
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
    values
  };
}
