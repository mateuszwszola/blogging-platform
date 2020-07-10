import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useUserFavoritePosts } from 'hooks/usePost';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import PostCard from 'components/layout/PostCard';
import { Button } from 'components/layout/Button';

function ProfileFavorites({ profileId }) {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useUserFavoritePosts(profileId);

  const posts = data ? data.map((group) => group.posts).flat() : [];

  return (
    <>
      {status === 'loading' ? (
        <Loading />
      ) : status === 'error' ? (
        <DisplayError msg={error.message} />
      ) : (
        <>
          {posts.length > 0 ? (
            <div
              className={clsx(
                'grid grid-cols-1 row-gap-20 col-gap-12',
                posts.length > 1 && 'lg:grid-cols-2'
              )}
            >
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <h2 className="text-center text-2xl">There are no posts</h2>
          )}

          {posts.length > 0 && canFetchMore ? (
            <div className="flex justify-center mt-20">
              <Button
                onClick={() => fetchMore()}
                disabled={!!(!canFetchMore || isFetchingMore)}
                size="sm"
                version="secondary"
              >
                {isFetchingMore
                  ? 'Loading more...'
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

ProfileFavorites.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ProfileFavorites;
