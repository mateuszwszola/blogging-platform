import React from 'react';
import PropTypes from 'prop-types';
import { useUserPosts } from 'hooks/usePost';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import Posts from 'components/Posts';

function ProfilePosts({ profileId }) {
  const { status, error, data: posts } = useUserPosts(profileId);

  return (
    <>
      {error ? (
        <DisplayError msg={error.message} />
      ) : status === 'loading' ? (
        <Loading />
      ) : (
        <Posts posts={posts} />
      )}
    </>
  );
}

ProfilePosts.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ProfilePosts;
