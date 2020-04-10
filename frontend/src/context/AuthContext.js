import React, { useState, useLayoutEffect } from 'react';
import { useAsync } from 'react-async';
import * as auth from 'api/auth';
import Loading from 'components/Loading';

const AuthContext = React.createContext();

async function getUserData() {
  const user = await auth.getUser();
  if (!user) {
    return Promise.resolve({ user: null });
  }
  return Promise.resolve({ user });
}

function AuthProvider(props) {
  const [firstAttemptFinished, setFirstAttemptFinished] = useState(false);
  const {
    data = { user: null },
    error,
    isRejected,
    isPending,
    isSeattled,
    reload,
  } = useAsync({
    promiseFn: getUserData,
  });

  useLayoutEffect(() => {
    if (isSeattled) {
      setFirstAttemptFinished(true);
    }
  }, [isSeattled]);

  if (!firstAttemptFinished) {
    if (isPending) {
      return <Loading />;
    }
    if (isRejected) {
      console.error(error.message);
      return <div>You were logged out. Try refresh the page</div>;
    }
  }

  const login = async (formData) => {
    // auth.login(formData).then(reload);
    try {
      await auth.login(formData);
      reload();
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  };

  const register = async (formData) => {
    // auth.register(formData).then(reload);
    try {
      await auth.register(formData);
      reload();
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  };

  const logout = () => {
    auth.logout();
    reload();
  };

  return (
    <AuthContext.Provider
      value={{ data, login, register, logout }}
      {...props}
    />
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
