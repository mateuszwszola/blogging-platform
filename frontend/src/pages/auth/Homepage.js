import React from 'react';
import { useHomepagePosts } from 'hooks/usePost';
import { Button } from 'components/layout/Button';
import DisplayError from 'components/DisplayError';
import Loading from 'components/Loading';
import Posts from 'components/Posts';
import useDebouncedSearchKey from 'hooks/useDebouncedSearchKey';
import useInput from 'hooks/useInput';
import SearchBar from 'components/layout/SearchBar';

function Homepage() {
  const [inputValue, handleInputValueChange] = useInput('');
  const searchKey = useDebouncedSearchKey(inputValue);
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useHomepagePosts(searchKey);

  const posts = data ? data.map((group) => group.posts).flat() : [];

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
      </div>

      <div className="flex w-full justify-end items-center">
        <SearchBar
          inputValue={inputValue}
          handleInputValueChange={handleInputValueChange}
        />
      </div>

      <div className="mt-8">
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
