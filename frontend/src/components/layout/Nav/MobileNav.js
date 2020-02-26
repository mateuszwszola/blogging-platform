import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import MobileNavLink from './MobileNavLink';
import { useAuth } from '../../../context/AuthContext';

const MobileNav = ({ navOpen, setNavOpen }) => {
  const isHidden = navOpen ? true : false;
  const tabIndex = isHidden ? 0 : 1;
  const auth = useAuth();

  const navClassnames = clsx(
    'flex flex-col justify-center items-center fixed top-0 left-0 h-screen w-full bg-gray-900 text-gray-400 transition-ease md:max-w-sm z-10',
    { 'translate-x-0': navOpen, '-translate-x-full': !navOpen }
  );
  return (
    <nav aria-hidden={!isHidden} className={navClassnames}>
      <div className="w-full flex flex-col items-center justify-around h-full py-64">
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
          <MobileNavLink
            onClick={() => {
              setNavOpen(false);
              auth.logout();
            }}
            to="/login"
            tabIndex={tabIndex}
          >
            Logout
          </MobileNavLink>
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
