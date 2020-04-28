import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import useImgUpload from 'hooks/useImgUpload';
import Loading from 'components/Loading';
import UploadImgAvatar from 'components/layout/UploadImgAvatar';
import styles from './Profile.module.css';
import { ArrowLeftIcon } from 'icons/ArrowLeftIcon';
import { SettingsIcon } from 'icons/SettingsIcon';

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

  const userPhotoId = photoId || (user.photo ? user.photo : null);

  return (
    <div className="h-full px-2 pb-2 pt-8 md:pt-20">
      <div className="flex flex-col">
        <div className="mt-8 w-full max-w-xs mx-auto bg-white rounded-t-md shadow-md">
          <div className="flex flex-col items-center p-2 border-b border-gray-200">
            {imgLoading ? (
              <Loading />
            ) : (
              <>
                <UploadImgAvatar
                  handlePhotoChange={handlePhotoChange}
                  userPhotoId={userPhotoId}
                  styles={styles}
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
              <p className="text-red-500 text-sm text-center">
                {error.message}
              </p>
            )}
          </div>
          <h1 className="text-2xl text-center py-4 text-gray-800">
            {user.name}
          </h1>

          <div className="flex flex-col w-full">
            <Link
              className="p-4 bg-gray-300 hover:bg-gray-400 text-gray-700 hover:text-gray-800 border-t border-b border-gray-400 flex justify-between items-center"
              to="/settings"
            >
              <span className="font-medium">Settings</span>
              <SettingsIcon className="fill-current w-5 h-5" />
            </Link>

            <button
              className="p-4 bg-gray-300 hover:bg-gray-400 text-gray-700 hover:text-gray-800 border-t border-b border-gray-400 flex justify-between items-center"
              onClick={handleLogout}
            >
              <span className="font-medium">Log Out</span>
              <ArrowLeftIcon className="fill-current w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
