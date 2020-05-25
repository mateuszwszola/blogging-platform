import React from 'react';
import PropTypes from 'prop-types';
import { useUserBlogs } from 'hooks/useBlog';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import Blogs from 'components/Blogs';

function ProfileBlogs({ userId }) {
  const { status, error, data: blogs } = useUserBlogs(userId);

  return (
    <div className="relative">
      {error ? (
        <DisplayError msg={error.message} />
      ) : status === 'loading' ? (
        <Loading />
      ) : (
        <Blogs blogs={blogs} />
      )}
    </div>
  );
}

ProfileBlogs.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default ProfileBlogs;
