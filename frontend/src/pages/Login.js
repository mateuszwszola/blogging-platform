import React from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import useForm from 'hooks/useForm';
import useStatus from 'hooks/useStatus';
import { useAuth } from 'context/AuthContext';
import validate from 'utils/loginFormValidationRules';
import { InputGroup, InputSubmit } from 'components/layout/Input';
import { LoadingWithOverlay } from 'components/Loading';
import { EnvelopeIcon, LockOpenIcon, KeyIcon } from 'icons';

function Login({
  email,
  password,
  handleChange,
  handleSubmit,
  errors,
  loading,
  ...props
}) {
  return (
    <div className="flex-auto flex justify-center items-center bg-gray-900 px-4 py-2 sm:py-4">
      <div className="flex flex-col justify-center items-center max-w-xs sm:max-w-sm w-full relative">
        {loading && <LoadingWithOverlay />}
        <div className={`${loading ? 'opacity-50 ' : ''}text-red-500 z-20`}>
          <LockOpenIcon className="w-32 h-32 sm:w-40 sm:h-40 fill-current" />
        </div>

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
              <span className="text-gray-300 ml-2 select-none">
                Remember me
              </span>
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
      </div>
    </div>
  );
}

Login.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

function LoginContainer() {
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
    login,
    validate
  );
  const auth = useAuth();
  const { loading, requestStarted, requestFailed } = useStatus();
  const history = useHistory();

  async function login() {
    const data = { email, password };
    requestStarted();
    try {
      await auth.login(data);
      history.push('/dashboard');
    } catch (err) {
      requestFailed();
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({
          message: err.message || 'There is a problem with the server.',
        });
      }
    }
  }

  return (
    <Login
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      email={email}
      password={password}
      errors={errors}
      loading={loading}
    />
  );
}

export default LoginContainer;
