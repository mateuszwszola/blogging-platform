import React from 'react';
import NavLink from './NavLink';
import { useAuth } from '../../../context/AuthContext';

const DesktopNav = () => {
  const auth = useAuth();

  return (
    <nav className="px-10 py-4 text-gray-500 flex justify-end w-full">
      <NavLink
        to="/"
        className="text-lg px-4 py-2 mr-2 font-medium hover:text-gray-400"
      >
        Home
      </NavLink>
      <NavLink
        to="/explore"
        className="text-lg px-4 py-2 mr-2 font-medium hover:text-gray-400"
      >
        Explore
      </NavLink>
      {auth.data.user ? (
        <button
          onClick={auth.logout}
          className="text-lg px-4 py-2 mr-2 font-medium hover:text-gray-400"
        >
          Logout
        </button>
      ) : (
        <NavLink
          to="/login"
          className="text-lg px-4 py-2 mr-2 font-medium hover:text-gray-400"
        >
          Login
        </NavLink>
      )}
    </nav>
  );
};

export default DesktopNav;
