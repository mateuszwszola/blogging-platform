import React from 'react';
import clsx from 'clsx';
import { useHomepagePosts } from 'hooks/usePost';
import { Button } from 'components/layout/Button';
import DisplayError from 'components/DisplayError';
import Loading from 'components/Loading';
import PostCard from 'components/layout/PostCard';

function Homepage() {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useHomepagePosts();

  const numberOfPosts = data && data.map((group) => group.posts).flat().length;

  return status === 'loading' ? (
    <Loading />
  ) : status === 'error' ? (
    <DisplayError msg={error.message} />
  ) : (
    <div className="py-16 w-full max-w-screen-xl mx-auto">
      <h1 className="text-3xl text-center leading-loose my-8">
        Welcome to Blogging Platform!
      </h1>
      <div className="mx-2 mt-12">
        <div
          className={clsx(
            'grid grid-cols-1 row-gap-20 col-gap-12',
            numberOfPosts > 1 && 'lg:grid-cols-2'
          )}
        >
          {numberOfPosts > 0 ? (
            <>
              {data.map((group, i) => (
                <React.Fragment key={i}>
                  {group.posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </React.Fragment>
              ))}
            </>
          ) : (
            <h2 className="text-center text-2xl">There are no posts</h2>
          )}
        </div>

        {numberOfPosts > 0 ? (
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
      </div>
    </div>
  );
}

export default Homepage;
