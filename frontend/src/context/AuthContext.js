import React, { useState } from 'react';
import { useAsync } from 'react-async';
import * as auth from '../api/auth';

const AuthContext = React.createContext();

async function getUserData() {
  const user = await auth.getUser();
  if (!user) {
    return { user: null };
  }
  return { user };
}

function AuthProvider(props) {
  const [firstAttemptFinished, setFirstAttemptFinished] = useState(false);
  const {
    data = { user: null },
    error,
    isRejected,
    isPending,
    isSeattled,
    reload
  } = useAsync({
    promiseFn: getUserData
  });

  React.useLayoutEffect(() => {
    if (isSeattled) {
      setFirstAttemptFinished(true);
    }
  }, [isSeattled]);

  if (!firstAttemptFinished) {
    if (isPending) {
      return <div>Loading...</div>;
    }
    if (isRejected) {
      return (
        <div>
          <p>There was a problem. Try refreshing the page</p>
          <p>{error.message}</p>
        </div>
      );
    }
  }

  const login = async formData => {
    try {
      await auth.login(formData);
      reload();
    } catch (err) {
      return Promise.reject(err);
    }
  };
  const register = formData => {
    auth.register(formData).then(reload);
  };
  const logout = async () => {
    try {
      await auth.logout();
      reload();
    } catch (err) {
      console.log(err);
    }
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
