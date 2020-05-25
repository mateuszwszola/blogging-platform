import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { GridIcon, HeartIcon, GlobeIcon } from 'icons';

function ProfileNav() {
  const { url } = useRouteMatch();

  return (
    <ul className="list-none flex justify-center space-x-8">
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
        <li className="flex items-center p-2">
          <GlobeIcon className="fill-current w-5 h-5" />
          <span className="uppercase ml-2">Blogs</span>
        </li>
      </NavLink>
      <NavLink
        to={`${url}/favorites`}
        className="text-gray-600"
        activeClassName="text-gray-900 font-semibold"
      >
        <li className="flex items-center p-2">
          <HeartIcon className="fill-current w-5 h-5" />
          <span className="uppercase ml-2">Favorite</span>
        </li>
      </NavLink>
    </ul>
  );
}

export default ProfileNav;
