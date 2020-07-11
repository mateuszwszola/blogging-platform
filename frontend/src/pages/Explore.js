import React from 'react';
import clsx from 'clsx';
import { useAllBlogs } from 'hooks/useBlog';
import useInput from 'hooks/useInput';
import useDebouncedSearchKey from 'hooks/useDebouncedSearchKey';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import BlogCard from 'components/layout/BlogCard';
import { Button } from 'components/layout/Button';
import SearchBar from 'components/layout/SearchBar';

function Explore() {
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
  } = useAllBlogs(searchKey);

  const blogs = data ? data.map((group) => group.blogs).flat() : [];

  return (
    <div className="py-16 max-w-screen-xl w-full mx-auto px-2">
      <h1 className="text-4xl font-semibold text-center leading-loose my-8">
        Explore Blogs
      </h1>

      <div className="flex w-full justify-end items-center">
        <SearchBar
          inputValue={inputValue}
          handleInputValueChange={handleInputValueChange}
        />
      </div>

      <div className="px-2 mt-8 w-full">
        {status === 'loading' ? (
          <Loading />
        ) : status === 'error' ? (
          <DisplayError msg={error.message} />
        ) : (
          <div className="w-full">
            {blogs.length > 0 ? (
              <div
                className={clsx(
                  'grid grid-cols-1 row-gap-20 col-gap-12',
                  blogs.length > 1 && 'lg:grid-cols-2'
                )}
              >
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            ) : (
              <h2 className="text-center text-2xl">No search results...</h2>
            )}
          </div>
        )}

        {blogs.length > 0 && canFetchMore ? (
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

export default Explore;
