import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { GridIcon, HeartIcon, GlobeIcon, UserIcon } from 'icons';

function ProfileNav({ isOwner }) {
  const { url } = useRouteMatch();

  return (
    <ul className="list-none flex flex-col items-center sm:flex-row sm:justify-center space-y-4 sm:space-x-8 sm:space-y-0">
      <NavLink
        to={url}
        className="text-gray-600"
        activeClassName="text-gray-900 font-semibold"
      >
        <li className="flex items-center p-2">
          <GridIcon className="fill-current w-5 h-5" />
          <span className="uppercase ml-2">Posts</span>
        </li>
      </NavLink>
      <NavLink
        to={`${url}/blogs`}
        className="text-gray-600"
        activeClassName="text-gray-900 font-semibold"
      >
        <li className="flex flex-1 items-center p-2">
          <GlobeIcon className="fill-current w-5 h-5" />
          <span className="uppercase ml-2">Blogs</span>
        </li>
      </NavLink>
      {isOwner && (
        <>
          <NavLink
            to={`${url}/favorites`}
            className="text-gray-600"
            activeClassName="text-gray-900 font-semibold"
          >
            <li className="flex flex-1 items-center p-2">
              <HeartIcon className="fill-current w-5 h-5" />
              <span className="uppercase ml-2">Favorite</span>
            </li>
          </NavLink>
          <NavLink
            to={`${url}/following`}
            className="text-gray-600"
            activeClassName="text-gray-900 font-semibold"
          >
            <li className="flex flex-1 items-center p-2">
              <UserIcon className="fill-current w-5 h-5" />
              <span className="uppercase ml-2">Following</span>
            </li>
          </NavLink>
        </>
      )}
    </ul>
  );
}

ProfileNav.propTypes = {
  isOwner: PropTypes.bool.isRequired,
};

export default ProfileNav;
