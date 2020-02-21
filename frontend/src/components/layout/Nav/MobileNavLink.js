import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const MobileNavLink = ({ tabIndex, children, ...props }) => (
  <Link
    {...props}
    className="text-2xl py-8 flex items-center"
    tabIndex={tabIndex}
  >
    {children}
  </Link>
);

MobileNavLink.propTypes = {
  tabIndex: PropTypes.number.isRequired
};

export default MobileNavLink;
