import React, { useState, useEffect } from 'react';
import { login, register, logout, getUser } from '../api/auth';

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [user, setUser] = useState({ user: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getUser();
        setUser({
          user: data.user
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
        return (
          <div>
            <p>There was a problem. Try refreshing the page</p>
            <p>{error.message}</p>
          </div>
        );
      }
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const login = async formData => {
    setLoading(true);
    const data = await login(formData);
    setUser(data);
  };
}
