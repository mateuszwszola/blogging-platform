import React from 'react';
import NavLink from './NavLink';

const DesktopNav = () => {
  return (
    <nav className="px-8 py-4 text-gray-600 flex justify-end w-full">
      <NavLink to="/" className="text-lg px-4 py-2 mr-2 font-medium">
        Home
      </NavLink>
      <NavLink to="/explore" className="text-lg px-4 py-2 mr-2 font-medium">
        Explore
      </NavLink>
      <NavLink to="/login" className="text-lg px-4 py-2 mr-2 font-medium">
        Login
      </NavLink>
    </nav>
  );
};

export default DesktopNav;
