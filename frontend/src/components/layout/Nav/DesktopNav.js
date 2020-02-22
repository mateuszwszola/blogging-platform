import React from 'react';
import NavLink from './NavLink';

const DesktopNav = () => {
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
      <NavLink
        to="/login"
        className="text-lg px-4 py-2 mr-2 font-medium hover:text-gray-400"
      >
        Login
      </NavLink>
    </nav>
  );
};

export default DesktopNav;
