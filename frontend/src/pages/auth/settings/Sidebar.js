import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import useLogoutWithRedirect from 'hooks/useLogoutWithRedirect';
import { ArrowLeftIcon } from 'icons';

const Sidebar = ({ url }) => {
  const handleLogout = useLogoutWithRedirect();

  return (
    <div className="w-full max-w-xs lg:w-64 lg:absolute lg:left-0 lg:ml-4">
      <nav className="flex flex-col divide-y divide-gray-300 border border-gray-300 rounded bg-white">
        <NavLink
          className="px-4 py-2"
          activeClassName="border-l-2"
          to={`${url}/profile`}
        >
          Profile
        </NavLink>
        <NavLink
          className="px-4 py-2"
          activeClassName="border-l-2"
          to={`${url}/account`}
        >
          Account
        </NavLink>
      </nav>
      <div className="mt-4">
        <button
          onClick={handleLogout}
          className="border border-gray-300 rounded w-full px-4 py-2 bg-white text-gray-600 hover:text-gray-700 flex justify-between items-center"
        >
          <span className="font-medium">Sign Out</span>
          <ArrowLeftIcon className="fill-current w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Sidebar;
