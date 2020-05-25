import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useUser } from 'context/UserContext';
import MobileNavLink from './MobileNavLink';

const MobileNav = ({ navOpen, setNavOpen }) => {
  const isHidden = navOpen ? true : false;
  const tabIndex = isHidden ? 0 : 1;
  const { user } = useUser();

  const navClassnames = clsx(
    'fixed top-0 left-0 bottom-0 right-0 text-gray-400 transform transition-all duration-300 ease-in-out z-40',
    navOpen ? 'translate-x-0' : '-translate-x-full'
  );

  const hideNav = () => setNavOpen(false);

  return (
    <nav
      aria-hidden={!isHidden}
      className={navClassnames}
      style={{ backgroundColor: 'rgba(45, 55, 72, 0.95)' }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <MobileNavLink onClick={hideNav} to="/" tabIndex={tabIndex}>
          Home
        </MobileNavLink>
        <MobileNavLink onClick={hideNav} to="/explore" tabIndex={tabIndex}>
          Explore
        </MobileNavLink>
        {user ? (
          <>
            <MobileNavLink
              onClick={hideNav}
              to="/dashboard"
              tabIndex={tabIndex}
            >
              Dashboard
            </MobileNavLink>
            <MobileNavLink
              onClick={hideNav}
              to={`/profile/${user._id}`}
              tabIndex={tabIndex}
            >
              Profile
            </MobileNavLink>
          </>
        ) : (
          <MobileNavLink onClick={hideNav} to="/login" tabIndex={tabIndex}>
            Login
          </MobileNavLink>
        )}
      </div>
    </nav>
  );
};

MobileNav.propTypes = {
  navOpen: PropTypes.bool.isRequired,
  setNavOpen: PropTypes.func.isRequired,
};

export default MobileNav;
