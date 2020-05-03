import React, { useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { useUser } from 'context/UserContext';
import useImgUpload from 'hooks/useImgUpload';
import { ArrowLeftIcon } from 'icons/ArrowLeftIcon';
import { SettingsIcon } from 'icons/SettingsIcon';
import Loading from 'components/Loading';
import UploadImgAvatar from 'components/layout/UploadImgAvatar';
import UpdateUserForm from 'components/UpdateUserForm';
import { API_BASE_URL } from 'api/client';

function Profile() {
  const { logout } = useAuth();
  const { user, setUser } = useUser();
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
    photoUploadError,
    photoId,
  ] = useImgUpload('users/photo');

  useEffect(() => {
    if (photoId) {
      setUser({ photo: photoId });
    }
  }, [photoId, setUser]);

  const getPhotoSrc = (photoId) => `${API_BASE_URL}/photos/${photoId}`;
  const userPhotoSrc =
    (photoId && getPhotoSrc(photoId)) ||
    (user.photo ? getPhotoSrc(user.photo) : null);

  return (
    <div className="h-full px-2 pb-2 pt-8 md:pt-20">
      <div className="flex flex-col">
        <div className="mt-8 w-full max-w-xs mx-auto bg-white rounded-t-md shadow-md">
          <div className="flex flex-col items-center p-2 border-b border-gray-200 relative">
            {imgLoading ? (
              <Loading />
            ) : (
              <>
                <UploadImgAvatar
                  handlePhotoChange={handlePhotoChange}
                  userPhotoSrc={userPhotoSrc}
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
            {photoUploadError && (
              <p className="text-red-500 text-sm text-center">
                {photoUploadError.message}
              </p>
            )}
          </div>
          <h1 className="text-2xl text-center py-4 text-gray-800">
            {user.name}
          </h1>

          <div className="flex flex-col w-full">
            <Link
              className="p-4 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-700 border-t border-b border-gray-300 flex justify-between items-center"
              to="/settings"
            >
              <span className="font-medium">Settings</span>
              <SettingsIcon className="fill-current w-5 h-5" />
            </Link>

            <button
              className="p-4 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-700 border-t border-b border-gray-300 flex justify-between items-center"
              onClick={handleLogout}
            >
              <span className="font-medium">Log Out</span>
              <ArrowLeftIcon className="fill-current w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto mt-4">
          <UpdateUserForm />
        </div>
      </div>
    </div>
  );
}

export default Profile;
