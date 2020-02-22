import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, LockOpenIcon, KeyIcon } from '../../Icons';
import { useForm } from '../../hooks';
import { postData } from '../../api/API';

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
      {errors.length > 0 && (
        <ul>
          {errors.map(error => (
            <li className="text-red-200 text-lg">{error}</li>
          ))}
        </ul>
      )}
      <div className="h-full flex flex-col justify-center items-center px-4 max-w-sm mx-auto">
        <div className="text-red-500">
          <LockOpenIcon className="w-40 h-40 fill-current" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col w-full mt-2">
          <label className="my-2 sm:my-3 relative">
            <input
              value={email}
              onChange={handleChange}
              className="bg-gray-100 w-full rounded py-2 px-4 pl-10 outline-none focus:shadow-outline"
              type="email"
              name="email"
              placeholder="e-mail address"
              required
            />
            <div className="absolute top-0 left-0 bottom-0 flex items-center p-2 pl-3 text-gray-400">
              <EnvelopeIcon className="w-4 h-4 fill-current" />
            </div>
          </label>
          <label className="my-2 sm:my-3 relative">
            <input
              value={password}
              onChange={handleChange}
              className="bg-gray-100 w-full rounded py-2 px-4 pl-10 outline-none focus:shadow-outline"
              type="password"
              name="password"
              placeholder="password"
              required
            />
            <div className="absolute top-0 left-0 bottom-0 flex items-center p-2 pl-3 text-gray-400">
              <KeyIcon className="w-4 h-4 fill-current" />
            </div>
          </label>

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
            <input
              className="w-full rounded-full py-2 px-4 uppercase bg-red-500 hover:bg-red-400 text-gray-900 font-semibold cursor-pointer focus:outline-none focus:shadow-outline"
              type="submit"
              value="Login"
            />
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
  errors: PropTypes.array.isRequired
};

function LoginContainer() {
  const {
    handleChange,
    handleSubmit,
    handleReset,
    values: { email, password }
  } = useForm(
    {
      email: '',
      password: ''
    },
    login
  );
  const [errors, setErrors] = useState([]);

  function createError(field, msg) {
    return { field, msg };
  }

  async function login() {
    const data = { email, password };

    try {
      const res = await postData('/users/login', data);
      console.log(res);
      handleReset();
    } catch (error) {
      console.log('error catched', error);
      setErrors([...errors, error]);
    }
  }

  return (
    <Login
      errors={errors}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      email={email}
      password={password}
    />
  );
}

export default LoginContainer;
