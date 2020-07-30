import React from 'react';
import { useHistory } from 'react-router-dom';
import useStatus from 'hooks/useStatus';
import { useAuth } from 'context/AuthContext';
import Form from 'pages/login/Form';
import { LoadingWithOverlay } from 'components/Loading';
import { LockClosedIcon } from 'icons';

function Login() {
  const auth = useAuth();
  const history = useHistory();
  const { loading, requestStarted, requestFailed } = useStatus();

  const handleLogin = async (data, setErrors) => {
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
  };

  return (
    <div className="flex-auto flex justify-center items-center bg-gray-900 px-4 py-2 sm:py-4">
      <div className="flex flex-col justify-center items-center max-w-xs sm:max-w-sm w-full relative">
        {loading && <LoadingWithOverlay />}

        <div className={`${loading ? 'opacity-50 ' : ''}text-red-500 z-20`}>
          <LockClosedIcon className="w-32 h-32 sm:w-40 sm:h-40 fill-current" />
        </div>

        <Form onLogin={handleLogin} loading={loading} />
      </div>
    </div>
  );
}

export default Login;
