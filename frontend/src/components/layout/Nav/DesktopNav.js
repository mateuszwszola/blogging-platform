import React from 'react';
import NavLink from './NavLink';
import { useAuth } from '../../../context/AuthContext';
import { useOnClickOutside, useToggle } from '../../../hooks';

const DesktopNav = () => {
  const auth = useAuth();
  const navNode = React.useRef();
  const [isOpen, setIsOpen, toggleIsOpen] = useToggle(false);
  useOnClickOutside(navNode, () => setIsOpen(false));

  const authLinks = (
    <>
      <NavLink
        to="/explore"
        className="block text-lg px-4 py-2 font-medium text-gray-500 hover:text-gray-400"
      >
        Explore
      </NavLink>
      <NavLink
        to="/dashboard"
        className="block text-lg px-4 py-2 font-medium text-gray-500 hover:text-gray-400"
      >
        Dashboard
      </NavLink>
      <div className="relative ml-3">
        <div>
          <button
            onClick={toggleIsOpen}
            className="max-w-xs flex items-center text-sm rounded-full text-gray-400 focus:outline-none focus:shadow-solid"
          >
            <svg
              className="h-8 w-8 rounded-full fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM7 6v2a3 3 0 1 0 6 0V6a3 3 0 1 0-6 0zm-3.65 8.44a8 8 0 0 0 13.3 0 15.94 15.94 0 0 0-13.3 0z" />
            </svg>
          </button>
        </div>
        <div
          style={{ display: isOpen ? 'block' : 'none' }}
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg"
        >
          <div className="py-1 rounded-md bg-white shadow-xs">
            <NavLink
              to="/profile"
              className="block text-sm px-4 py-2 font-medium text-gray-700"
            >
              Your Profile
            </NavLink>
            <NavLink
              to="/settings"
              className="block text-sm px-4 py-2 font-medium text-gray-700"
            >
              Settings
            </NavLink>
            <button
              onClick={auth.logout}
              className="block text-sm px-4 py-2 font-medium text-gray-700 focus:outline-none focus:shadow-solid"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const links = (
    <>
      <NavLink
        to="/explore"
        className="block text-lg px-4 py-2 font-medium text-gray-500 hover:text-gray-400"
      >
        Explore
      </NavLink>
      <NavLink
        to="/login"
        className="block text-lg px-4 py-2 font-medium text-gray-500 hover:text-gray-400"
      >
        Login
      </NavLink>
    </>
  );

  return (
    <nav className="py-4" ref={navNode}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <NavLink
              to="/"
              className="block text-lg px-4 py-2 font-medium text-gray-500 hover:text-gray-400"
            >
              Home
            </NavLink>
          </div>
          <div className="flex items-center">
            {auth.data.user ? authLinks : links}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNav;
