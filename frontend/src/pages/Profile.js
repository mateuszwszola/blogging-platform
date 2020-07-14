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
import { useUserProfile } from 'hooks/useProfile';
import OwnerProtectedRoute from 'components/OwnerProtectedRoute';
import ProfilePosts from 'components/Profile/Posts';
import ProfileBlogs from 'components/Profile/Blogs';
import ProfileFavorites from 'components/Profile/Favorites';
import ProfileFollowing from 'components/Profile/Following';
import ProfileNav from 'components/Profile/Nav';
import { UserAvatar } from 'components/UserAvatar';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import { Button } from 'components/layout/Button';
import { ArrowLeftIcon, SettingsIcon } from 'icons';
import { useFollowProfile, useUnfollowProfile } from 'hooks/useProfile';

function Profile() {
  const history = useHistory();
  const { path } = useRouteMatch();
  const { userId } = useParams();
  const { data, logout } = useAuth();
  const { data: profile, status, error } = useUserProfile(userId);
  const [followProfile] = useFollowProfile();
  const [unfollowProfile] = useUnfollowProfile();

  const isAuthenticated = !!data.user;

  const handleLogout = async () => {
    await logout();
    history.push('/');
  };

  const handleFollow = () => {
    if (!isAuthenticated || !profile) return;

    if (profile.isFollowing) {
      unfollowProfile(profile._id);
    } else {
      followProfile(profile._id);
    }
  };

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
              <div className="w-full flex justify-center items-center py-2">
                <UserAvatar avatarURL={profile.avatar?.image_url} />
              </div>

              <div className="border-t sm:py-4 px-2">
                <h3 className="text-2xl text-center font-semibold text-gray-800">
                  {profile.name}
                </h3>
                {profile.bio && (
                  <p className="text-lg text-gray-700 text-center">
                    {profile.bio}
                  </p>
                )}
              </div>

              {profile.isOwner ? (
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
              ) : isAuthenticated ? (
                <div className="pt-2 pb-4 px-4 flex justify-center">
                  <Button onClick={handleFollow} fullWidth version="secondary">
                    {profile.isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                </div>
              ) : (
                ''
              )}
            </div>

            <div className="mt-10 border-t border-solid border-gray-400 pt-4">
              <ProfileNav isOwner={profile.isOwner} />

              <div className="mt-8 relative">
                <Switch>
                  <Route exact path={path}>
                    <ProfilePosts profileId={profile._id} />
                  </Route>
                  <Route path={`${path}/blogs`}>
                    <ProfileBlogs profileId={profile._id} />
                  </Route>
                  <OwnerProtectedRoute
                    path={`${path}/favorites`}
                    isOwner={profile.isOwner}
                  >
                    <ProfileFavorites
                      profileId={profile._id}
                      isOwner={profile.isOwner}
                    />
                  </OwnerProtectedRoute>

                  <OwnerProtectedRoute
                    path={`${path}/following`}
                    isOwner={profile.isOwner}
                  >
                    <ProfileFollowing
                      profileId={profile._id}
                      isOwner={profile.isOwner}
                    />
                  </OwnerProtectedRoute>
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
