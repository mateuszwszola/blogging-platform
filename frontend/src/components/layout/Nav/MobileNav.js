import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import MobileNavLink from './MobileNavLink';

const MobileNav = ({ navOpen, setNavOpen }) => {
  const isHidden = navOpen ? true : false;
  const tabIndex = isHidden ? 0 : 1;

  const navClassnames = clsx(
    'flex flex-col justify-center items-center p-8 fixed top-0 left-0 h-screen w-full bg-red-100 text-black transform md:max-w-sm shadow-lg z-10',
    { 'translate-x-0': navOpen, '-translate-x-full': !navOpen }
  );
  return (
    <nav aria-hidden={!isHidden} className={navClassnames}>
      <MobileNavLink
        onClick={() => setNavOpen(false)}
        to="/"
        tabIndex={tabIndex}
      >
        <span>Home</span>
      </MobileNavLink>
      <MobileNavLink
        onClick={() => setNavOpen(false)}
        to="/explore"
        tabIndex={tabIndex}
      >
        <span>Explore</span>
      </MobileNavLink>
      <MobileNavLink
        onClick={() => setNavOpen(false)}
        to="/login"
        tabIndex={tabIndex}
      >
        <span>Login</span>
      </MobileNavLink>
    </nav>
  );
};

MobileNav.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  setNavOpen: PropTypes.func.isRequired
};

export default MobileNav;
