import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { sendResetPasswordEmail } from 'api/auth';
import { useAlert } from 'context/AlertContext';
import useInput from 'hooks/useInput';
import InputGroup from 'components/InputGroup';
import InputSubmit from 'components/InputSubmit';
import { EnvelopeIcon } from 'icons';

function ForgotPassword() {
  const [email, handleEmailChange, emailInputReset] = useInput('');
  const [sendEmail, { isLoading }] = useMutation(sendResetPasswordEmail);
  const { setAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    sendEmail(
      { email },
      {
        onSuccess: (res) => {
          setAlert('success', res.message, 3000);
          emailInputReset();
        },
        onError: (err) => {
          setAlert('error', err.message, 3000);
        },
      }
    );
  };

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
          <InputGroup
            value={email}
            handleChange={handleEmailChange}
            name="email"
            type="email"
            placeholder="e-mail address"
            icon={EnvelopeIcon}
            required
          />

          <div className="w-11/12 mx-auto mt-4">
            <InputSubmit value="Send recovery email" disabled={isLoading} />
          </div>

          <div className="mt-2 text-center">
            <p className="text-gray-100">Do you have an account?</p>
            <Link
              to="/login"
              disabled={isLoading}
              className="text-red-500 px-4 py-2"
            >
              {isLoading ? 'loading...' : 'Login'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
