import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { useUser } from 'context/UserContext';
import { useAlert } from 'context/AlertContext';
import usePhotoFile from 'hooks/usePhotoFile';
import { useUploadUserAvatar } from 'hooks/useUser';
import Loading from 'components/Loading';
import UploadImgAvatar from 'components/layout/UploadImgAvatar';
import UpdateUserForm from 'components/UpdateUserForm';
import { ArrowLeftIcon } from 'icons/ArrowLeftIcon';
import { SettingsIcon } from 'icons/SettingsIcon';

function Profile() {
  const { logout } = useAuth();
  const { user, setUser } = useUser();
  const { setAlert } = useAlert();
  const history = useHistory();
  const { photoFile, handlePhotoChange, handlePhotoReset } = usePhotoFile();
  const [
    uploadUserAvatar,
    { data: photoURL, status: avatarStatus, error: avatarError },
  ] = useUploadUserAvatar();

  const handleLogout = async () => {
    await logout();
    history.push('/');
  };

  const handleAvatarUpload = () => {
    uploadUserAvatar(
      { photoFile },
      {
        onSuccess: (photoURL) => {
          setAlert('success', 'Img uploaded');
          setUser({ avatar: { ...user.avatar, photoURL } });
        },
        onSettled: () => {
          handlePhotoReset();
        },
      }
    );
  };

  const userPhotoSrc =
    photoURL || (user.avatar && user.avatar.photoURL) || null;

  return (
    <div className="w-full py-16 px-2 max-w-screen-xl mx-auto">
      <div className="flex flex-col">
        <div className="mt-8 w-full max-w-xs mx-auto bg-white rounded-t-md shadow-md">
          <div
            style={{ minHeight: '14rem' }}
            className="flex flex-col items-center justify-center p-2 border-b border-gray-200 relative"
          >
            {avatarStatus === 'loading' ? (
              <Loading />
            ) : (
              <>
                <UploadImgAvatar
                  photoFile={photoFile}
                  handlePhotoChange={handlePhotoChange}
                  userPhotoSrc={userPhotoSrc}
                />
                {photoFile && (
                  <div className="w-full flex flex-wrap justify-around mt-2 mx-2 space-x-4">
                    <button
                      onClick={handleAvatarUpload}
                      className="flex-1 rounded bg-blue-500 text-blue-100 py-1 px-2 shadow"
                    >
                      Upload Image
                    </button>
                    <button
                      onClick={handlePhotoReset}
                      className="flex-1 rounded bg-red-500 text-red-100 py-1 px-2 shadow"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </>
            )}
            {avatarError && (
              <p className="text-red-500 text-sm text-center">
                {avatarError.message}
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
