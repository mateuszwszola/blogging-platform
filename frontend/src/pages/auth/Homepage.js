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

  return (
    <div className="w-full max-w-screen-xl mx-auto px-2 py-16">
      <div className="flex flex-col items-center md:flex-row md:justify-between md:items-end">
        <div className="py-16 md:w-1/2">
          <h1 className="text-6xl font-semibold leading-loose">Posts</h1>
          <p className="text-gray-600 text-xl">
            These posts are a collection of newest posts created by You, users
            You follow and from blogs, You like to read
          </p>
        </div>

        {/* <div className="w-full md:w-1/2 flex flex-col items-center">
          <label htmlFor="search" className="font-semibold text-gray-600">
            Search
          </label>
          <input
            id="search"
            type="text"
            className="block w-full max-w-xs border border-gray-500 bg-gray-200 rounded px-4 py-2"
          />
        </div> */}
      </div>

      <div className="mt-8">
        {status === 'loading' ? (
          <Loading />
        ) : status === 'error' ? (
          <DisplayError msg={error.message} />
        ) : (
          <>
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

            {numberOfPosts > 0 && canFetchMore ? (
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
      </div>
    </div>
  );
}

export default Homepage;
