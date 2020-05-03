import React from 'react';
import { Link } from 'react-router-dom';

const NavLink = ({ children, ...props }) => (
  <Link
    {...props}
    className="block text-lg px-4 py-2 font-medium text-gray-500 hover:text-gray-400 focus:outline-none focus:shadow-outline"
  >
    {children}
  </Link>
);

export default NavLink;
