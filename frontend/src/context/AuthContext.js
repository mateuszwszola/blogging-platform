import React, {
  createContext,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
import { useAsync } from 'react-async';
import * as auth from 'api/auth';
import Loading from 'components/Loading';
import { bootstrapAppData } from 'utils/bootstrap';

const AuthContext = createContext();

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
    promiseFn: bootstrapAppData,
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
