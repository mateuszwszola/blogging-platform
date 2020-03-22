import React from 'react';
import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';
import { AlertProvider } from './AlertContext';

function AppProviders({ children }) {
  return (
    <AlertProvider>
      <AuthProvider>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </AlertProvider>
  );
}

export default AppProviders;
