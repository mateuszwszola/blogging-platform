import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LockClosedIcon, UserIcon, EnvelopeIcon, KeyIcon } from '../../icons';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../context/AuthContext';

function Register({
  name,
  email,
  password,
  password2,
  handleSubmit,
  handleChange,
  ...props
}) {
  return (
    <main className="w-full h-screen bg-gray-900 font-sans">
      <div className="h-full flex flex-col justify-center items-center px-4 max-w-sm mx-auto">
        <div className="text-red-500">
          <LockClosedIcon className="w-40 h-40 fill-current" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col w-full mt-2">
          <label className="my-2 sm:my-3 relative">
            <input
              value={name}
              onChange={handleChange}
              className="bg-gray-100 w-full rounded py-2 px-4 pl-10 outline-none focus:shadow-outline"
              name="name"
              type="text"
              placeholder="name"
              required
            />
            <div className="absolute top-0 left-0 bottom-0 flex items-center p-2 pl-3 text-gray-400">
              <UserIcon className="w-4 h-4 fill-current" />
            </div>
          </label>
          <label className="my-2 sm:my-3 relative">
            <input
              value={email}
              onChange={handleChange}
              className="bg-gray-100 w-full rounded py-2 px-4 pl-10 outline-none focus:shadow-outline"
              name="email"
              type="email"
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
              name="password"
              type="password"
              placeholder="password"
              required
            />
            <div className="absolute top-0 left-0 bottom-0 flex items-center p-2 pl-3 text-gray-400">
              <KeyIcon className="w-4 h-4 fill-current" />
            </div>
          </label>
          <label className="my-2 sm:my-3 relative">
            <input
              value={password2}
              onChange={handleChange}
              className="bg-gray-100 w-full rounded py-2 px-4 pl-10 outline-none focus:shadow-outline"
              name="password2"
              type="password"
              placeholder="confirm password"
              required
            />
            <div className="absolute top-0 left-0 bottom-0 flex items-center p-2 pl-3 text-gray-400">
              <KeyIcon className="w-4 h-4 fill-current" />
            </div>
          </label>

          <div className="w-11/12 mx-auto mt-3 sm:mt-4">
            <input
              className="w-full rounded-full py-2 px-4 uppercase bg-red-500 hover:bg-red-400 text-gray-900 font-semibold cursor-pointer focus:outline-none focus:shadow-outline"
              type="submit"
              value="Sign Up"
            />
          </div>

          <div className="mt-2 sm:mt-4 text-center">
            <p className="text-gray-100">Do you have an account?</p>
            <Link to="/login" className="text-red-500 px-4 py-2">
              Login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

Register.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  password2: PropTypes.string.isRequired
};

function RegisterContainer() {
  const {
    handleChange,
    handleSubmit,
    values: { name, email, password, password2 }
  } = useForm(
    {
      name: '',
      email: '',
      password: '',
      password2: ''
    },
    register
  );

  const auth = useAuth();

  async function register() {
    const data = { name, email, password };
    try {
      await auth.register(data);
    } catch (err) {
      console.log(err);
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
    />
  );
}

export default RegisterContainer;
