import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import UserAvatarPlaceholder from './UserAvatarPlaceholder';

const UserAvatar = ({ avatarURL, size }) => {
  const sizes = {
    lg: 'w-40 h-40 md:w-48 md:h-48',
  };
  return (
    <div
      className={clsx(
        'shadow-md rounded-full overflow-hidden border',
        sizes[size]
      )}
    >
      {avatarURL ? (
        <img
          className="object-cover w-full h-full rounded-full border"
          src={avatarURL}
          alt=""
        />
      ) : (
        <UserAvatarPlaceholder />
      )}
    </div>
  );
};

UserAvatar.defaultProps = {
  size: 'lg',
};

UserAvatar.propTypes = {
  avatarURL: PropTypes.string,
  size: PropTypes.string,
};

export default UserAvatar;
