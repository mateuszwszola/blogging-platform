import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { EnvelopeIcon } from 'icons';
import useInput from 'hooks/useInput';
import { sendResetPasswordEmail } from 'api/auth';
import useStatus from 'hooks/useStatus';

function ForgotPassword({
  handleSubmit,
  handleEmailChange,
  email,
  loading,
  ...props
}) {
  return (
    <div className="flex-auto flex justify-center items-center bg-gray-900 px-4 py-2 sm:py-4">
      <div className="flex flex-col justify-center items-center max-w-xs sm:max-w-sm w-full">
        <div className="text-red-500">
          <svg
            className="w-32 h-32 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M18 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z" />
          </svg>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col w-full mt-2">
          <label className="my-2 sm:my-3 relative">
            <input
              value={email}
              onChange={handleEmailChange}
              className="bg-gray-100 w-full rounded py-2 px-4 pl-10 outline-none focus:shadow-outline"
              name="email"
              type="email"
              placeholder="e-mail address"
            />
            <div className="absolute top-0 left-0 bottom-0 flex items-center p-2 pl-3 text-gray-500">
              <EnvelopeIcon className="w-4 h-4 fill-current" />
            </div>
          </label>

          <div className="w-11/12 mx-auto mt-4">
            <input
              className="w-full rounded-full py-2 px-4 uppercase bg-red-500 hover:bg-red-400 text-gray-900 font-semibold cursor-pointer focus:outline-none focus:shadow-outline"
              type="submit"
              value="Send Recovery Email"
            />
          </div>

          <div className="mt-2 text-center">
            <p className="text-gray-100">Do you have an account?</p>
            <Link
              to="/login"
              disabled={loading}
              className="text-red-500 px-4 py-2"
            >
              {loading ? 'Loading...' : 'Login'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

ForgotPassword.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  handleEmailChange: PropTypes.func.isRequired,
};

function ForgotPasswordContainer(props) {
  const [email, handleEmailChange, emailInputReset] = useInput('');
  const {
    loading,
    success,
    error,
    requestStarted,
    requestSuccessful,
    requestFailed,
  } = useStatus();

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
    requestStarted();
    sendResetPasswordEmail({ email })
      .then((response) => {
        requestSuccessful();
        console.log(response);
        emailInputReset();
      })
      .catch((err) => {
        requestFailed();
        console.error(err);
      });
    */
  };
  return (
    <ForgotPassword
      handleSubmit={handleSubmit}
      email={email}
      handleEmailChange={handleEmailChange}
      loading={loading}
    />
  );
}

export default ForgotPasswordContainer;
