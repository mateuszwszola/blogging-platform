import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { useAlert } from 'context/AlertContext';
import { useUploadUserAvatar } from 'hooks/useUser';
import usePhotoFile from 'hooks/usePhotoFile';
import { useUser } from 'context/UserContext';
import Loading from '../Loading';
import { Button } from '../layout/Button';
import { UserAvatar } from '../UserAvatar';
import { UploadIcon } from 'icons/UploadIcon';
import { deleteUserAvatar } from 'api/user';

const AvatarUpload = () => {
  const { user, setUser } = useUser();
  const { setAlert } = useAlert();
  const [photo, setPhoto] = useState(null);
  const { photoFile, handlePhotoChange, handlePhotoReset } = usePhotoFile();
  const [uploadUserAvatar, { status: avatarStatus }] = useUploadUserAvatar();
  const [removeAvatar, { status: removeStatus }] = useMutation(
    deleteUserAvatar
  );

  const userAvatarSrc = user.avatar && user.avatar.image_url;

  useEffect(() => {
    if (photoFile) {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        setPhoto(e.target.result);
      };
      reader.readAsDataURL(photoFile);
    } else {
      setPhoto(null);
    }
  }, [photoFile]);

  const handleAvatarUpload = () => {
    uploadUserAvatar(
      { photoFile },
      {
        onSuccess: (avatarURL) => {
          setAlert('success', 'Avatar uploaded');
          setUser({ avatar: { ...user.avatar, image_url: avatarURL } });
        },
        onSettled: () => {
          handlePhotoReset();
        },
        onError: () => {
          setAlert('error', 'Cannot upload avatar');
        },
      }
    );
  };

  const handleAvatarRemove = () => {
    if (!user.avatar?.image_url) return;

    removeAvatar()
      .then((res) => {
        setAlert('success', res.message);
        setUser({ avatar: {} });
      })
      .catch((err) => {
        setAlert('error', err.message);
      });
  };

  return (
    <div
      style={{ minHeight: '14rem' }}
      className="w-full flex flex-col justify-center items-center relative"
    >
      {avatarStatus === 'loading' || removeStatus === 'loading' ? (
        <Loading />
      ) : (
        <>
          <div className="relative">
            <UserAvatar avatarURL={photo || userAvatarSrc} size="lg" />

            <label className="group absolute top-0 left-0 bottom-0 right-0 text-blue-400 rounded-full hover:bg-gray-100 cursor-pointer focus:outline-none">
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
                  onChange={handlePhotoChange}
                />
              </div>
            </label>
          </div>

          {photoFile ? (
            <div className="w-full flex flex-wrap justify-center mt-2 p-2 space-x-4">
              <div className="flex-1">
                <Button
                  onClick={handleAvatarUpload}
                  version="secondary"
                  size="sm"
                  fullWidth
                >
                  Upload Image
                </Button>
              </div>
              <div className="flex-1">
                <Button
                  onClick={handlePhotoReset}
                  version="delete"
                  size="sm"
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : user.avatar?.image_url ? (
            <div className="mt-2">
              <Button size="sm" version="delete" onClick={handleAvatarRemove}>
                Remove avatar
              </Button>
            </div>
          ) : (
            ''
          )}
        </>
      )}
    </div>
  );
};

export default AvatarUpload;
