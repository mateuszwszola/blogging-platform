import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useToggle from 'hooks/useToggle';
import profileImg from 'img/undraw_profile.svg';
import NavLink from './NavLink';
import { API_BASE_URL } from 'api/client';

const DesktopNav = () => {
  const { data, logout } = useAuth();
  const navNode = useRef();
  const history = useHistory();
  const [isOpen, setIsOpen, toggleIsOpen] = useToggle(false);
  useOnClickOutside(navNode, () => setIsOpen(false));

  const handleLogout = async () => {
    await logout();
    history.push('/');
  };

  const hideNav = () => setIsOpen(false);

  const photoId = (data.user && data.user.photo) || null;

  const authLinks = (
    <>
      <NavLink
        onClick={hideNav}
        to="/explore"
        className="block text-lg px-4 py-2 font-medium text-gray-500 hover:text-gray-400"
      >
        Explore
      </NavLink>
      <NavLink
        onClick={hideNav}
        to="/dashboard"
        className="block text-lg px-4 py-2 font-medium text-gray-500 hover:text-gray-400"
      >
        Dashboard
      </NavLink>
      <div className="relative ml-3">
        <div>
          <button
            onClick={toggleIsOpen}
            aria-label="Toggle profile menu"
            className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-outline"
          >
            {photoId ? (
              <img
                className="h-10 w-10 rounded-full border-2 border-gray-700"
                src={`${API_BASE_URL}/photos/${photoId}`}
                alt=""
              />
            ) : (
              <img
                className="h-10 w-10 rounded-full border border-gray-700"
                src={profileImg}
                alt="User Profile"
              />
            )}
          </button>
        </div>
        <div
          style={{ display: isOpen ? 'block' : 'none' }}
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg"
        >
          <div className="py-1 rounded-md bg-white shadow-xs">
            <NavLink
              onClick={hideNav}
              to="/profile"
              className="block text-sm px-4 py-2 font-medium text-gray-700"
            >
              Your Profile
            </NavLink>
            <NavLink
              onClick={hideNav}
              to="/settings"
              className="block text-sm px-4 py-2 font-medium text-gray-700"
            >
              Settings
            </NavLink>
            <button
              onClick={handleLogout}
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
    <nav className="px-12 h-16" ref={navNode}>
      <div className="mx-auto h-full">
        <div className="h-full flex items-center justify-between">
          <div>
            <NavLink
              to="/"
              className="block text-lg px-4 py-2 font-medium text-gray-500 hover:text-gray-400"
            >
              Home
            </NavLink>
          </div>
          <div className="flex items-center">
            {data.user ? authLinks : links}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNav;
