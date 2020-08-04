import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const NavLink = ({ tabIndex, children, ...props }) => (
  <Link
    {...props}
    className="block w-full text-center text-4xl py-2 my-8 focus:outline-none focus:shadow-outline"
    tabIndex={tabIndex}
  >
    {children}
  </Link>
);

NavLink.propTypes = {
  tabIndex: PropTypes.number.isRequired,
};

export default NavLink;
