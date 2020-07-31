import React from 'react';
import { Route, Switch, useRouteMatch, useParams } from 'react-router-dom';
import { useUserProfile } from 'hooks/useProfile';
import Posts from 'pages/profile/Posts';
import Blogs from 'pages/profile/Blogs';
import Nav from 'pages/profile/Nav';
import Favorites from 'pages/profile/Favorites';
import Following from 'pages/profile/Following';
import UserCard from 'pages/profile/UserCard';
import DisplayError from 'components/DisplayError';
import Loading from 'components/Loading';
import OwnerProtectedRoute from 'components/OwnerProtectedRoute';

function Profile() {
  const { path } = useRouteMatch();
  const { userId } = useParams();
  const { data: profile, status, error } = useUserProfile(userId);

  return (
    <>
      {status === 'loading' ? (
        <Loading />
      ) : error ? (
        <DisplayError msg={error.message} />
      ) : (
        <div className="w-full py-16 px-2 max-w-screen-xl mx-auto">
          <div className="flex flex-col">
            <UserCard profile={profile} />

            <div className="mt-10 border-t border-solid border-gray-400 pt-4">
              <Nav isOwner={profile.isOwner} />

              <div className="mt-8 relative">
                <Switch>
                  <Route exact path={path}>
                    <Posts profileId={profile._id} />
                  </Route>
                  <Route path={`${path}/blogs`}>
                    <Blogs profileId={profile._id} />
                  </Route>
                  <OwnerProtectedRoute
                    path={`${path}/favorites`}
                    isOwner={profile.isOwner}
                  >
                    <Favorites
                      profileId={profile._id}
                      isOwner={profile.isOwner}
                    />
                  </OwnerProtectedRoute>

                  <OwnerProtectedRoute
                    path={`${path}/following`}
                    isOwner={profile.isOwner}
                  >
                    <Following
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
