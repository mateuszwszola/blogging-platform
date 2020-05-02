import React, {
  createContext,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
import { useAsync } from 'react-async';
import * as auth from 'api/auth';
import { updateUser as updateUserAPI } from 'api/user';
import Loading from 'components/Loading';

const AuthContext = createContext();

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

  const login = useCallback(
    (formData) => {
      return auth
        .login(formData)
        .then(reload)
        .catch((err) => Promise.reject(err));
    },
    [reload]
  );

  const register = useCallback(
    (formData) => {
      return auth
        .register(formData)
        .then(reload)
        .catch((err) => Promise.reject(err));
    },
    [reload]
  );

  const logout = useCallback(() => {
    auth.logout();
    reload();
  }, [reload]);

  const updateUser = useCallback(
    (newUserData) => {
      return updateUserAPI(newUserData)
        .then(reload)
        .catch((err) => Promise.reject(err));
    },
    [reload]
  );

  if (!firstAttemptFinished) {
    if (isPending) {
      return <Loading />;
    }
    if (isRejected) {
      console.error(error.message);
    }
  }

  return (
    <AuthContext.Provider
      value={{ data, login, register, logout, updateUser }}
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
