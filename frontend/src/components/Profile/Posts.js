import React from 'react';
import PropTypes from 'prop-types';
import { useUserPosts } from 'hooks/usePost';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import Posts from 'components/Posts';

function ProfilePosts({ userId }) {
  const { status, error, data: posts } = useUserPosts(userId);

  return (
    <div className="relative">
      {error ? (
        <DisplayError msg={error.message} />
      ) : status === 'loading' ? (
        <Loading />
      ) : (
        <Posts posts={posts} />
      )}
    </div>
  );
}

ProfilePosts.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ProfilePosts;
