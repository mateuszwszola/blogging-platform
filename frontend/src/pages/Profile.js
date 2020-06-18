import React from 'react';
import {
  useHistory,
  Link,
  Route,
  Switch,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { useUser } from 'context/UserContext';
import { useUserProfile } from 'hooks/useProfile';
import AvatarUpload from 'components/AvatarUpload';
import ProfilePosts from 'components/Profile/Posts';
import ProfileBlogs from 'components/Profile/Blogs';
import ProfileFavorites from 'components/Profile/Favorites';
import ProfileNav from 'components/Profile/Nav';
import { UserAvatar } from 'components/UserAvatar';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import { ArrowLeftIcon, SettingsIcon } from 'icons';

function Profile() {
  const history = useHistory();
  const { path } = useRouteMatch();
  const { userId } = useParams();
  const { logout } = useAuth();
  const { user } = useUser();
  const { data: profile, status, error } = useUserProfile(userId);

  const isUserProfileOwner = user && profile && user._id === profile._id;

  const handleLogout = async () => {
    await logout();
    history.push('/');
  };

  const userAvatarSrc = profile && profile.avatar && profile.avatar.photoURL;

  return (
    <>
      {status === 'loading' ? (
        <Loading />
      ) : error ? (
        <DisplayError msg={error.message} />
      ) : (
        <div className="w-full py-16 px-2 max-w-screen-xl mx-auto">
          <div className="flex flex-col">
            <div className="mt-8 w-full max-w-xs mx-auto bg-white rounded-t-md shadow-md">
              <div
                style={{ minHeight: '14rem' }}
                className="w-full flex justify-center items-center py-2"
              >
                {isUserProfileOwner ? (
                  <AvatarUpload />
                ) : (
                  <UserAvatar avatarURL={userAvatarSrc} />
                )}
              </div>

              <div className="border-t py-4">
                <h3 className="text-2xl text-center font-semibold text-gray-800">
                  {profile.name}
                </h3>
                {profile.bio && (
                  <p className="text-lg text-gray-700 text-center">
                    {profile.bio}
                  </p>
                )}
              </div>

              {isUserProfileOwner && (
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
              )}
            </div>

            <div className="mt-10 border-t border-solid border-gray-400 pt-4">
              <ProfileNav />

              <div className="mt-8 relative">
                <Switch>
                  <Route exact path={path}>
                    <ProfilePosts profileId={profile._id} />
                  </Route>
                  <Route path={`${path}/blogs`}>
                    <ProfileBlogs profileId={profile._id} />
                  </Route>
                  <Route path={`${path}/favorites`}>
                    <ProfileFavorites profileId={profile._id} />
                  </Route>
                </Switch>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
