import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const NavLink = ({ tabIndex, children, ...props }) => (
  <Link
    {...props}
    className="text-3xl py-8 flex items-center"
    tabIndex={tabIndex}
  >
    {children}
  </Link>
);

NavLink.propTypes = {
  tabIndex: PropTypes.number.isRequired
};

export default NavLink;
