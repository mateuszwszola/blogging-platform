import React from 'react';
import PropTypes from 'prop-types';
import { useUserBlogs } from 'hooks/useBlog';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import Blogs from 'components/Blogs';

function ProfileBlogs({ profileId }) {
  const { status, error, data: blogs } = useUserBlogs(profileId);

  return (
    <>
      {error ? (
        <DisplayError msg={error.message} />
      ) : status === 'loading' ? (
        <Loading />
      ) : (
        <Blogs blogs={blogs} />
      )}
    </>
  );
}

ProfileBlogs.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ProfileBlogs;
