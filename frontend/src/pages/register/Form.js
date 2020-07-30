import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { UserIcon, EnvelopeIcon, KeyIcon } from 'icons';
import { InputGroup, InputSubmit } from 'components/layout/Input';
import useForm from 'hooks/useForm';
import validate from 'utils/registerFormValidationRules';

function Form({ onRegister, loading }) {
  const {
    handleChange,
    handleSubmit,
    values: { name, email, password, password2 },
    errors,
    setErrors,
  } = useForm(
    {
      name: '',
      email: '',
      password: '',
      password2: '',
    },
    () => onRegister({ name, email, password }, setErrors),
    validate
  );

  return (
    <>
      {errors.message && (
        <p className="text-red-500 text-sm">{errors.message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className={`${
          loading ? 'opacity-50 ' : ''
        }flex flex-col w-full sm:mt-2`}
      >
        <InputGroup
          isError={
            !!(
              Object.keys(errors).length > 0 &&
              (errors.name || errors.message)
            )
          }
          errors={errors}
          type="text"
          name="name"
          placeholder="name"
          value={name}
          handleChange={handleChange}
          icon={UserIcon}
        />
        <InputGroup
          isError={
            !!(
              Object.keys(errors).length > 0 &&
              (errors.email || errors.message)
            )
          }
          errors={errors}
          type="email"
          name="email"
          placeholder="e-mail address"
          value={email}
          handleChange={handleChange}
          icon={EnvelopeIcon}
        />
        <InputGroup
          isError={
            !!(
              Object.keys(errors).length > 0 &&
              (errors.password || errors.message)
            )
          }
          errors={errors}
          type="password"
          name="password"
          placeholder="password"
          value={password}
          handleChange={handleChange}
          icon={KeyIcon}
        />
        <InputGroup
          isError={
            !!(
              Object.keys(errors).length > 0 &&
              (errors.password2 || errors.message)
            )
          }
          errors={errors}
          type="password"
          name="password2"
          placeholder="confirm password"
          value={password2}
          handleChange={handleChange}
          icon={KeyIcon}
        />

        <div className="w-11/12 mx-auto mt-2 sm:mt-4">
          <InputSubmit value="Sign Up" />
        </div>

        <div className="mt-2 sm:mt-4 text-center">
          <p className="text-gray-100">Do you have an account?</p>
          <Link to="/login" className="text-red-500 px-4 py-2">
            Login
          </Link>
        </div>
      </form>
    </>
  );
}

Form.propTypes = {
  onRegister: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Form;
