import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { UserCircleIcon } from 'icons';

function ProfileCard({ profile }) {
  return (
    <div className="w-full max-w-xs mx-auto flex flex-col justify-center items-center bg-white rounded-lg border border-gray-400 shadow-lg py-12">
      <Link
        to={`/profile/${profile._id}`}
        className="no-underline flex flex-col items-center"
      >
        {profile.avatar?.image_url ? (
          <img
            src={profile.avatar.image_url}
            alt=""
            className="w-16 h-16 border border-gray-400"
          />
        ) : (
          <UserCircleIcon className="w-16 h-16 rounded-full fill-current text-gray-600 border border-gray-400" />
        )}
        <span className="block mt-2 text-blue-600 font-semibold text-xl">
          {profile.name}
        </span>
      </Link>
    </div>
  );
}

ProfileCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileCard;
