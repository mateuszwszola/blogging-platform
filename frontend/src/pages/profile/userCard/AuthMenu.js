import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, SettingsIcon } from 'icons';
import useLogoutWithRedirect from 'hooks/useLogoutWithRedirect';

function AuthMenu() {
  const logout = useLogoutWithRedirect();

  return (
    <div className="flex flex-col w-full">
      <Link
        className="p-4 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-700 border-t border-b border-gray-300 flex justify-between items-center"
        to="/settings"
      >
        <span className="font-medium">Settings</span>
        <SettingsIcon className="fill-current w-5 h-5" />
      </Link>

      <button
        onClick={logout}
        className="p-4 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-700 border-t border-b border-gray-300 flex justify-between items-center"
      >
        <span className="font-medium">Log Out</span>
        <ArrowLeftIcon className="fill-current w-5 h-5" />
      </button>
    </div>
  );
}

export default AuthMenu;
