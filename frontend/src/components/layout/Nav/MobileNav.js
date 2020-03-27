import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import MobileNavLink from './MobileNavLink';
import { useAuth } from '../../../context/AuthContext';

const MobileNav = ({ navOpen, setNavOpen }) => {
  const isHidden = navOpen ? true : false;
  const tabIndex = isHidden ? 0 : 1;
  const auth = useAuth();
  const history = useHistory();

  const navClassnames = clsx(
    'flex flex-col justify-center items-center fixed top-0 left-0 h-screen w-full text-gray-400 transform transition-all duration-300 ease-in-out md:max-w-sm z-40',
    navOpen ? 'translate-x-0' : '-translate-x-full'
  );

  const handleLogout = async () => {
    setNavOpen(false);
    await auth.logout();
    history.push('/');
  };

  return (
    <nav
      aria-hidden={!isHidden}
      className={navClassnames}
      style={{ backgroundColor: 'rgba(45, 55, 72, 0.95)' }}
    >
      <div className="w-full flex flex-col items-center justify-around h-full">
        <MobileNavLink
          onClick={() => setNavOpen(false)}
          to="/"
          tabIndex={tabIndex}
        >
          Home
        </MobileNavLink>
        <MobileNavLink
          onClick={() => setNavOpen(false)}
          to="/explore"
          tabIndex={tabIndex}
        >
          Explore
        </MobileNavLink>
        {auth.data.user ? (
          <>
            <MobileNavLink
              onClick={() => setNavOpen(false)}
              to="/profile"
              tabIndex={tabIndex}
            >
              Profile
            </MobileNavLink>
            <MobileNavLink
              onClick={() => setNavOpen(false)}
              to="/dashboard"
              tabIndex={tabIndex}
            >
              Dashboard
            </MobileNavLink>
            <MobileNavLink
              onClick={() => setNavOpen(false)}
              to="/settings"
              tabIndex={tabIndex}
            >
              Settings
            </MobileNavLink>
            <MobileNavLink
              onClick={handleLogout}
              to="/login"
              tabIndex={tabIndex}
            >
              Logout
            </MobileNavLink>
          </>
        ) : (
          <MobileNavLink
            onClick={() => setNavOpen(false)}
            to="/login"
            tabIndex={tabIndex}
          >
            Login
          </MobileNavLink>
        )}
      </div>
    </nav>
  );
};

MobileNav.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  setNavOpen: PropTypes.func.isRequired
};

export default MobileNav;
