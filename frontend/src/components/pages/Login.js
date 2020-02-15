import React from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, LockOpenIcon, KeyIcon } from '../../Icons';

function Login() {
  return (
    <main className="w-full h-screen bg-gray-900 font-sans">
      <div className="h-full flex flex-col justify-center items-center px-4 max-w-sm mx-auto">
        <div className="text-red-500">
          <LockOpenIcon className="w-40 h-40 fill-current" />
        </div>
        <form className="flex flex-col w-full mt-2">
          <label className="my-2 sm:my-3 relative">
            <input
              className="bg-gray-100 w-full rounded py-2 px-4 pl-10 outline-none focus:shadow-outline"
              id="login"
              type="text"
              placeholder="e-mail address"
            />
            <div className="absolute top-0 left-0 bottom-0 flex items-center p-2 pl-3 text-gray-400">
              <EnvelopeIcon className="w-4 h-4 fill-current" />
            </div>
          </label>
          <label className="my-2 sm:my-3 relative">
            <input
              className="bg-gray-100 w-full rounded py-2 px-4 pl-10 outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="password"
            />
            <div className="absolute top-0 left-0 bottom-0 flex items-center p-2 pl-3 text-gray-400">
              <KeyIcon className="w-4 h-4 fill-current" />
            </div>
          </label>

          <div className="flex flex-col sm:flex-row sm:justify-between px-2 py-2 sm:my-1">
            <label className="flex items-center py-1 sm:py-0">
              <input
                className="bg-gray-100 p-2"
                id="remember-me"
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
              className="w-full rounded-full py-2 px-4 uppercase bg-red-500 hover:bg-red-400 text-gray-900 font-semibold cursor-pointer"
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

export default Login;
