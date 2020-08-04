import React from 'react';
import PropTypes from 'prop-types';
import { useUserPosts } from 'hooks/usePost';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import Button from 'components/Button';
import Posts from 'components/Posts';

function ProfilePosts({ profileId }) {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useUserPosts(profileId);

  const posts = data ? data.map((group) => group.posts).flat() : [];

  return (
    <>
      {status === 'loading' ? (
        <Loading />
      ) : status === 'error' ? (
        <DisplayError msg={error.message} />
      ) : (
        <>
          <Posts posts={posts} />

          {posts.length > 0 && canFetchMore ? (
            <div className="flex justify-center mt-20">
              <Button
                onClick={() => fetchMore()}
                disabled={!!(!canFetchMore || isFetchingMore)}
                size="sm"
                version="secondary"
              >
                {isFetchingMore
                  ? 'loading more...'
                  : canFetchMore
                  ? 'Load More'
                  : 'No more posts to load'}
              </Button>
            </div>
          ) : null}
          <div className="text-center relative mt-8">
            {isFetching && !isFetchingMore ? 'Fetching...' : null}
          </div>
        </>
      )}
    </>
  );
}

ProfilePosts.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ProfilePosts;
