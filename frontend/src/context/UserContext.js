import React from 'react';
import { useAuth } from './AuthContext';
import useUseState from 'hooks/useUseState';

const UserContext = React.createContext();

function UserProvider(props) {
  const { data } = useAuth();

  const [user, setUser] = useUseState(data.user);

  const value = React.useMemo(
    () => ({
      user,
      setUser,
    }),
    [user, setUser]
  );

  return <UserContext.Provider value={value} {...props} />;
}

function useUser() {
  const context = React.useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export { UserProvider, useUser };
