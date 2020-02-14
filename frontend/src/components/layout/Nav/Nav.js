import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import NavLink from './NavLink';

const Nav = ({ navOpen, setNavOpen }) => {
  const isHidden = navOpen ? true : false;
  const tabIndex = isHidden ? 0 : 1;

  const navClassnames = clsx(
    'flex flex-col justify-center items-center p-8 fixed top-0 left-0 h-screen w-full bg-red-100 text-black transform md:max-w-sm shadow-lg z-10',
    { 'translate-x-0': navOpen, '-translate-x-full': !navOpen }
  );
  return (
    <nav aria-hidden={!isHidden} className={navClassnames}>
      <NavLink onClick={() => setNavOpen(false)} to="/" tabIndex={tabIndex}>
        {/* <HomeIcon className="w-6 h-6 fill-current text-green-500" /> */}
        <span>Home</span>
      </NavLink>
      <NavLink
        onClick={() => setNavOpen(false)}
        to="/explore"
        tabIndex={tabIndex}
      >
        {/* <UserIcon className="w-6 h-6 fill-current text-green-500" /> */}
        <span>Explore</span>
      </NavLink>
      <NavLink
        onClick={() => setNavOpen(false)}
        to="/login"
        tabIndex={tabIndex}
      >
        {/* <LockClosedIcon className="w-6 h-6 fill-current text-green-500" /> */}
        <span>Login</span>
      </NavLink>
      <NavLink
        onClick={() => setNavOpen(false)}
        to="/register"
        tabIndex={tabIndex}
      >
        {/* <LockClosedIcon className="w-6 h-6 fill-current text-green-500" /> */}
        <span>Register</span>
      </NavLink>
    </nav>
  );
};

Nav.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  setNavOpen: PropTypes.func.isRequired
};

export default Nav;
