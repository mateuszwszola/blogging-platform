import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import Link from 'pages/profile/nav/Link';
import { GridIcon, HeartIcon, GlobeIcon, UserIcon } from 'icons';

function ProfileNav({ isOwner }) {
  const { url } = useRouteMatch();

  return (
    <ul className="list-none flex flex-col items-center sm:flex-row sm:justify-center space-y-4 sm:space-x-8 sm:space-y-0">
      <Link url={url}>
        <GridIcon className="fill-current w-5 h-5" />
        <span className="uppercase ml-2">Posts</span>
      </Link>
      <Link url={`${url}/blogs`}>
        <GlobeIcon className="fill-current w-5 h-5" />
        <span className="uppercase ml-2">Blogs</span>
      </Link>
      {isOwner && (
        <>
          <Link url={`${url}/favorites`}>
            <HeartIcon className="fill-current w-5 h-5" />
            <span className="uppercase ml-2">Favorite</span>
          </Link>
          <Link url={`${url}/following`}>
            <UserIcon className="fill-current w-5 h-5" />
            <span className="uppercase ml-2">Following</span>
          </Link>
        </>
      )}
    </ul>
  );
}

ProfileNav.propTypes = {
  isOwner: PropTypes.bool.isRequired,
};

export default ProfileNav;
