import React from 'react';
import PropTypes from 'prop-types';
import { useUserFavoritePosts } from 'hooks/usePost';
import Posts from 'components/Posts';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';

function ProfileFavorites({ profileId }) {
  const { status, error, data: posts } = useUserFavoritePosts(profileId);

  if (status === 'loading') {
    return <Loading />;
  }
  if (error) {
    return <DisplayError msg={error.message} />;
  }

  return <Posts posts={posts} />;
}

ProfileFavorites.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ProfileFavorites;
