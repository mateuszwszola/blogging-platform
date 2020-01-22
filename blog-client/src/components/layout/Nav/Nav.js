import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { HomeIcon, LockClosedIcon, UserIcon } from '../../../Icons';
import NavLink from './NavLink';

const Nav = ({ navOpen }) => {
  const isHidden = navOpen ? true : false;
  const tabIndex = isHidden ? 0 : 1;

  const navClassnames = clsx(
    'flex flex-col justify-center items-center p-8 fixed top-0 left-0 h-screen w-full text-center bg-gray-100 text-gray-900 transform md:max-w-sm shadow-lg z-10',
    { 'translate-x-0': navOpen, '-translate-x-full': !navOpen }
  );
  return (
    <nav aria-hidden={!isHidden} className={navClassnames}>
      <NavLink href="/" tabIndex={tabIndex}>
        <HomeIcon className="w-6 h-6 fill-current text-green-500" />
        <span className="ml-2">Home</span>
      </NavLink>
      <NavLink href="/" tabIndex={tabIndex}>
        <UserIcon className="w-6 h-6 fill-current text-green-500" />
        <span className="ml-2">Explore</span>
      </NavLink>
      <NavLink href="/" tabIndex={tabIndex}>
        <LockClosedIcon className="w-6 h-6 fill-current text-green-500" />
        <span className="ml-2">Sign Up</span>
      </NavLink>
    </nav>
  );
};

Nav.propTypes = {
  navOpen: PropTypes.bool.isRequired
};

export default Nav;
