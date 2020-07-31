import React from 'react';
import { Link } from 'react-router-dom';

const DropdownMenuLink = ({ children, ...props }) => (
  <Link
    {...props}
    className="block text-sm px-4 py-2 font-medium text-gray-700 focus:outline-none focus:shadow-outline"
  >
    {children}
  </Link>
);

export default DropdownMenuLink;
