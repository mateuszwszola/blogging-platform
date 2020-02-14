import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <main className="w-full h-screen bg-gray-900 font-sans">
      <div className="h-full flex flex-col justify-center items-center px-4 max-w-sm mx-auto">
        <div className="text-red-500">
          <svg
            className="w-40 h-40 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              className="heroicon-ui"
              d="M9 10h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h2V7a5 5 0 1 1 10 0 1 1 0 0 1-2 0 3 3 0 0 0-6 0v3zm-4 2v8h14v-8H5zm7 2a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1z"
            />
          </svg>
        </div>
        <form className="flex flex-col w-full mt-2">
          <label className="my-2 sm:my-3">
            <input
              className="bg-gray-100 w-full rounded py-2 px-4 outline-none focus:shadow-outline"
              id="login"
              type="text"
              placeholder="e-mail address"
            />
          </label>
          <label className="my-2 sm:my-3">
            <input
              className="bg-gray-100 w-full rounded py-2 px-4 outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="password"
            />
          </label>

          <div className="flex flex-col sm:flex-row sm:justify-between px-2 py-2 sm:my-1">
            <label className="flex items-center py-1 sm:py-0">
              <input
                className="bg-gray-100 p-2"
                id="remember-me"
                type="checkbox"
              />
              <span className="text-gray-300 ml-2">Remember me</span>
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
            <p className="text-gray-100">Do you have an account?</p>
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
