import React from 'react';
import PropTypes from 'prop-types';
import UserAvatarPlaceholder from './UserAvatarPlaceholder';
import { API_BASE_URL } from 'api/client';
import { UploadIcon } from 'icons/UploadIcon';

const UploadImgAvatar = ({ handlePhotoChange, userPhotoId, styles }) => (
  <div className="relative">
    <div className="rounded-full shadow-md">
      {userPhotoId ? (
        <div className="relative w-40 md:w-48 h-40 md:h-48 rounded-full overflow-hidden flex justify-center">
          <img
            className="w-auto h-full"
            src={`${API_BASE_URL}/photos/${userPhotoId}`}
            alt=""
          />
        </div>
      ) : (
        <UserAvatarPlaceholder />
      )}
    </div>

    <label
      className={`${styles.label} absolute top-0 left-0 bottom-0 right-0 text-blue-400 hover:bg-gray-100 rounded-full border border-gray-400 cursor-pointer`}
    >
      <div
        className={`${styles.uploadContent} h-full flex flex-col items-center justify-center`}
      >
        <UploadIcon className="w-8 md:w-10 h-8 md:h-10 text-blue-400 fill-current" />
        <span className="mt-2 text-sm leading-normal text-center">
          Select Image (jpeg, png)
        </span>
        <input
          className="sr-only"
          type="file"
          name="photo"
          id="user-photo"
          onChange={handlePhotoChange}
        />
      </div>
    </label>
  </div>
);

UploadImgAvatar.propTypes = {
  handlePhotoChange: PropTypes.func.isRequired,
  userPhotoId: PropTypes.string,
  styles: PropTypes.object.isRequired,
};

export default UploadImgAvatar;
