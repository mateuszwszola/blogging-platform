import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useForm from 'hooks/useForm';
import validate from 'utils/loginFormValidationRules';
import { InputGroup, InputSubmit } from 'components/layout/Input';
import { EnvelopeIcon, KeyIcon } from 'icons';

function Form({ onLogin, loading }) {
  const {
    handleChange,
    handleSubmit,
    values: { email, password },
    errors,
    setErrors,
  } = useForm(
    {
      email: '',
      password: '',
    },
    () => onLogin({ email, password }, setErrors),
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
        }flex flex-col w-full sm:mt-2"`}
      >
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

        <div className="flex flex-col sm:flex-row sm:justify-between p-2 sm:my-1">
          <label className="flex items-center py-1 sm:py-0">
            <input
              className="bg-gray-100 p-2"
              name="remember-me"
              type="checkbox"
            />
            <span className="text-gray-300 ml-2 select-none">Remember me</span>
          </label>

          <Link to="/forgotpassword" className="text-red-500">
            Forgot your password?
          </Link>
        </div>

        <div className="w-11/12 mx-auto mt-2 sm:mt-4">
          <InputSubmit value="Login" disabled={loading} />
        </div>

        <div className="mt-2 sm:mt-4 text-center">
          <p className="text-gray-100">You do not have an account?</p>
          <Link to="/register" className="text-red-500 px-4 py-2">
            Register
          </Link>
        </div>
      </form>
    </>
  );
}

Form.propTypes = {
  onLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Form;
