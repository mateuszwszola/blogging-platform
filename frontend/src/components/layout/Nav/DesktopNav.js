import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { useUser } from 'context/UserContext';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useToggle from 'hooks/useToggle';
import profileImg from 'img/undraw_profile.svg';
import NavLink from './NavLink';
import DropdownMenuLink from './DropdownMenuLink';

const DesktopNav = () => {
  const { logout } = useAuth();
  const { user } = useUser();
  const navNode = useRef();
  const history = useHistory();
  const [isOpen, toggleIsOpen, setIsOpen] = useToggle(false);
  useOnClickOutside(navNode, () => setIsOpen(false));

  const handleLogout = async () => {
    await logout();
    history.push('/');
  };

  const hideNav = () => setIsOpen(false);

  const userAvatar = user && user.avatar && user.avatar.photoURL;

  const authLinks = (
    <>
      <NavLink onClick={hideNav} to="/explore">
        Explore
      </NavLink>
      <NavLink onClick={hideNav} to="/dashboard">
        Dashboard
      </NavLink>
      <div className="relative ml-3">
        <div>
          <button
            onClick={toggleIsOpen}
            aria-label="Toggle profile menu"
            className="max-w-xs flex items-center text-sm rounded-full text-white focus:outline-none focus:shadow-outline"
          >
            {userAvatar ? (
              <img
                className="h-10 w-10 rounded-full border-2 border-gray-700"
                src={userAvatar}
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
            <DropdownMenuLink
              onClick={hideNav}
              to={`/profile/${user && user._id}`}
            >
              Your Profile
            </DropdownMenuLink>
            <DropdownMenuLink onClick={hideNav} to="/settings">
              Settings
            </DropdownMenuLink>
            <button
              onClick={handleLogout}
              className="block w-full text-left text-sm px-4 py-2 font-medium text-gray-700 focus:outline-none focus:shadow-outline"
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
      <NavLink to="/explore">Explore</NavLink>
      <NavLink to="/login">Login</NavLink>
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
          <div className="flex items-center">{user ? authLinks : links}</div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNav;
