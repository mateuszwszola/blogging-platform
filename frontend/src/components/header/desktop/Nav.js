import React, { useRef } from 'react';
import { useUser } from 'context/UserContext';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useToggle from 'hooks/useToggle';
import useLogoutWithRedirect from 'hooks/useLogoutWithRedirect';
import NavLink from 'components/header/desktop/nav/NavLink';
import DropdownMenuLink from 'components/header/desktop/nav/DropdownMenuLink';
import { UserCircleIcon } from 'icons';

const Nav = () => {
  const { user } = useUser();
  const navNode = useRef();
  const [isOpen, toggleIsOpen, setIsOpen] = useToggle(false);
  const handleLogout = useLogoutWithRedirect();

  useOnClickOutside(navNode, () => setIsOpen(false));

  const hideNav = () => setIsOpen(false);

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
            {user?.avatar?.image_url ? (
              <img
                className="w-10 h-10 rounded-full border-2 border-gray-700"
                src={user.avatar.image_url}
                alt=""
              />
            ) : (
              <UserCircleIcon className="w-10 h-10 rounded-full fill-current text-gray-400 border-2 border-gray-700" />
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

export default Nav;
