import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { LockClosedIcon, UserIcon, EnvelopeIcon, KeyIcon } from 'icons';
import useForm from 'hooks/useForm';
import { useAuth } from 'context/AuthContext';
import validate from 'utils/RegisterFormValidationRules';
import { InputGroup, InputSubmit } from 'components/layout/Input';
import Loading from 'components/Loading';

function Register({
  name,
  email,
  password,
  password2,
  handleSubmit,
  handleChange,
  errors,
  status,
  ...props
}) {
  const loading = status === 'loading';
  return (
    <div className="flex-auto flex justify-center items-center bg-gray-900 px-4 py-2 sm:py-4">
      <div className="flex flex-col justify-center items-center max-w-xs sm:max-w-sm w-full relative">
        {loading && (
          <div className="z-30 absolute top-0 bottom-0 left-0 right-0">
            <Loading />
          </div>
        )}
        <div className={`${loading ? 'opacity-50 ' : ''}text-red-500 z-20`}>
          <LockClosedIcon className="w-32 h-32 sm:w-40 sm:h-40 fill-current" />
        </div>

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
      </div>
    </div>
  );
}

Register.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  password2: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
};

function RegisterContainer() {
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
    register,
    validate
  );

  const auth = useAuth();
  const [status, setStatus] = useState('idle');
  const history = useHistory();

  async function register() {
    const data = { name, email, password };
    setStatus('loading');
    try {
      await auth.register(data);
      history.push('/dashboard');
    } catch (err) {
      setStatus('error');
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({
          message:
            err.message ||
            'There is a problem with the server. Try again later.',
        });
      }
    }
  }

  return (
    <Register
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      name={name}
      email={email}
      password={password}
      password2={password2}
      errors={errors}
      status={status}
    />
  );
}

export default RegisterContainer;
