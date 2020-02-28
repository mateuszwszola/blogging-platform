import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, LockOpenIcon, KeyIcon } from '../../icons';
import { useForm } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import validate from '../../utils/LoginFormValidationRules';
import { InputGroup, InputSubmit } from '../layout/Input';

function Login({
  email,
  password,
  handleChange,
  handleSubmit,
  errors,
  ...props
}) {
  return (
    <main className="w-full h-screen bg-gray-900 font-sans">
      <div className="h-full flex flex-col justify-center items-center px-4 max-w-sm mx-auto">
        <div className="text-red-500">
          <LockOpenIcon className="w-40 h-40 fill-current" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col w-full mt-2">
          <InputGroup
            isError={Object.keys(errors).length > 0}
            errors={errors}
            type="email"
            name="email"
            placeholder="e-mail address"
            value={email}
            handleChange={handleChange}
            icon={EnvelopeIcon}
          />
          <InputGroup
            isError={Object.keys(errors).length > 0}
            errors={errors}
            type="password"
            name="password"
            placeholder="password"
            value={password}
            handleChange={handleChange}
            icon={KeyIcon}
          />

          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message}</p>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between px-2 py-2 sm:my-1">
            <label className="flex items-center py-1 sm:py-0">
              <input
                className="bg-gray-100 p-2"
                name="remember-me"
                type="checkbox"
              />
              <span className="text-gray-300 ml-2 select-none">
                Remember me
              </span>
            </label>
            <Link to="/forgot-password" className="text-red-500">
              Forgot your password?
            </Link>
          </div>

          <div className="w-11/12 mx-auto mt-2 sm:mt-4">
            <InputSubmit value="Login" />
          </div>

          <div className="mt-2 sm:mt-4 text-center">
            <p className="text-gray-100">You do not have an account?</p>
            <Link to="/register" className="text-red-500 px-4 py-2">
              Register
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

Login.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

function LoginContainer() {
  const {
    handleChange,
    handleSubmit,
    values: { email, password },
    errors,
    setErrors
  } = useForm(
    {
      email: '',
      password: ''
    },
    login,
    validate
  );
  const auth = useAuth();

  async function login() {
    const data = { email, password };
    try {
      await auth.login(data);
    } catch (err) {
      setErrors(err);
    }
  }

  return (
    <Login
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      email={email}
      password={password}
      errors={errors}
    />
  );
}

export default LoginContainer;
