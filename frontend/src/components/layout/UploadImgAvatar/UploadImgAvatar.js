import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { UploadIcon } from 'icons/UploadIcon';
import UserAvatarPlaceholder from '../UserAvatarPlaceholder';

const UploadImgAvatar = ({ handlePhotoChange, userPhotoSrc }) => {
  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    handlePhotoChange(e);

    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = (e) => {
      setPhoto(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative">
      <div className="rounded-full shadow-md">
        {userPhotoSrc || photo ? (
          <div className="relative w-40 h-40 md:w-48 md:h-48 border rounded-full overflow-hidden">
            <img
              className="object-cover w-full h-full rounded-full"
              src={photo || userPhotoSrc}
              alt=""
            />
          </div>
        ) : (
          <UserAvatarPlaceholder />
        )}
      </div>

      <label className="group z-10 absolute top-0 left-0 bottom-0 right-0 text-blue-400 rounded-full hover:bg-gray-100 cursor-pointer focus:outline-none">
        <div className="invisible group-hover:visible h-full flex flex-col items-center justify-center">
          <UploadIcon className="w-8 md:w-10 h-8 md:h-10 text-blue-400 fill-current" />
          <span className="mt-2 text-sm leading-normal text-center">
            Select Image (jpeg, png)
          </span>
          <input
            className="sr-only"
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            name="photo"
            id="user-photo"
            onChange={handleChange}
          />
        </div>
      </label>
    </div>
  );
};

UploadImgAvatar.propTypes = {
  handlePhotoChange: PropTypes.func.isRequired,
  userPhotoId: PropTypes.string,
};

export default UploadImgAvatar;
