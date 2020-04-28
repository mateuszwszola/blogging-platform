import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import useImgUpload from 'hooks/useImgUpload';
import { UserIcon } from 'icons';
import { UploadIcon } from 'icons/UploadIcon';
import styles from './Profile.module.css';
import { API_BASE_URL } from 'api/client';
import Loading from 'components/Loading';

const UserAvatarPlaceholder = () => (
  <div className="rounded-full p-10 bg-gray-300">
    <UserIcon className="h-32 w-32 text-gray-700 fill-current" />
  </div>
);

const UploadImgAvatar = ({ handlePhotoChange, userPhoto }) => (
  <div className="rounded-full shadow-md relative">
    {userPhoto ? (
      <div className="w-56 h-56 rounded-full overflow-hidden">
        <img
          className="rounded-full"
          src={`${API_BASE_URL}/photos/${userPhoto}`}
          alt=""
        />
      </div>
    ) : (
      <UserAvatarPlaceholder />
    )}

    <label
      className={`${styles.label} absolute top-0 left-0 bottom-0 right-0 text-blue-400 hover:bg-gray-100 rounded-full border border-gray-400 cursor-pointer`}
    >
      <div
        className={`${styles.uploadContent} h-full flex flex-col items-center justify-center`}
      >
        <UploadIcon className="w-10 h-10 text-blue-400 fill-current" />
        <span className="mt-2 text-sm leading-normal text-center">
          Select Image (jpg, jpeg, png)
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

function Profile() {
  const { data, logout } = useAuth();
  const { user } = data;
  const history = useHistory();

  const handleLogout = async () => {
    await logout();
    history.push('/');
  };

  const [
    photoFile,
    handlePhotoChange,
    uploadPhoto,
    imgLoading,
    error,
    photoId,
  ] = useImgUpload('users/photo');

  const userPhoto = photoId ? photoId : user.photo ? user.photo : null;

  return (
    <div className="h-full">
      <div className="flex flex-col mt-20">
        <div className="flex flex-col items-center">
          {imgLoading ? (
            <Loading />
          ) : (
            <>
              <UploadImgAvatar
                handlePhotoChange={handlePhotoChange}
                userPhoto={userPhoto}
              />
              {photoFile && (
                <button
                  onClick={uploadPhoto}
                  className="mt-2 rounded bg-blue-500 text-blue-100 py-1 px-2"
                >
                  Upload
                </button>
              )}
            </>
          )}
          {error && (
            <p className="text-red-500 text-sm text-center">{error.message}</p>
          )}
        </div>
        <h1 className="text-2xl text-center py-6">Hello {user.name}!</h1>
      </div>
      <div className="flex flex-col flex-shrink-0">
        <div className="flex justify-around">
          <button
            className="px-4 py-2 rounded border-2 border-red-500"
            onClick={handleLogout}
          >
            Log Out
          </button>
          <Link className="p-2 rounded border-2 border-gray-500" to="/settings">
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;
