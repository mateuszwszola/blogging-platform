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
import AvatarUpload from 'components/AvatarUpload';
import { ArrowLeftIcon, SettingsIcon } from 'icons';
import ProfilePosts from 'components/Profile/Posts';
import ProfileBlogs from 'components/Profile/Blogs';
import ProfileFavorites from 'components/Profile/Favorites';
import ProfileNav from 'components/Profile/Nav';
import UserAvatarPlaceholder from 'components/layout/UserAvatarPlaceholder';

function Profile() {
  const { userId } = useParams();
  const { logout } = useAuth();
  const { user } = useUser();
  const history = useHistory();
  const { path } = useRouteMatch();

  const isOwner = user && user._id === userId;

  const handleLogout = async () => {
    await logout();
    history.push('/');
  };

  return (
    <div className="w-full py-16 px-2 max-w-screen-xl mx-auto">
      <div className="flex flex-col">
        <div className="mt-8 w-full max-w-xs mx-auto bg-white rounded-t-md shadow-md">
          {isOwner ? <AvatarUpload /> : <div></div>}

          <div className="border-t py-4">
            <h3 className="text-2xl text-center font-semibold text-gray-800">
              {user.name}
            </h3>
            {user.bio && (
              <p className="text-lg text-gray-700 text-center">{user.bio}</p>
            )}
          </div>

          {isOwner && (
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
                <ProfilePosts userId={userId} />
              </Route>
              <Route path={`${path}/blogs`}>
                <ProfileBlogs userId={userId} />
              </Route>
              <Route path={`${path}/favorites`}>
                <ProfileFavorites userId={userId} />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
