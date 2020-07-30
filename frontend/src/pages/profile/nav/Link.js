import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Link = ({ url, children }) => (
  <NavLink
    to={url}
    className="text-gray-600"
    activeClassName="text-gray-900 font-semibold"
  >
    <li className="flex items-center p-2">{children}</li>
  </NavLink>
);

Link.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Link;
