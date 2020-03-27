import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const MobileNavLink = ({ tabIndex, children, ...props }) => (
  <Link {...props} className="text-3xl py-4 px-6" tabIndex={tabIndex}>
    {children}
  </Link>
);

MobileNavLink.propTypes = {
  tabIndex: PropTypes.number.isRequired
};

export default MobileNavLink;
