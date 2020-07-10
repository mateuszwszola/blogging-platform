import React from 'react';
import clsx from 'clsx';
import { useAllBlogs } from 'hooks/useBlog';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import BlogCard from 'components/layout/BlogCard';
import { Button } from 'components/layout/Button';

function Explore() {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useAllBlogs();

  const numberOfBlogs = data && data.map((group) => group.blogs).flat().length;

  return (
    <div className="py-16 max-w-screen-xl w-full mx-auto">
      <h1 className="text-3xl text-center leading-loose my-8">Explore Blogs</h1>

      <div className="px-2 mt-8 w-full">
        {status === 'loading' ? (
          <Loading />
        ) : status === 'error' ? (
          <DisplayError msg={error.message} />
        ) : (
          <div className="w-full">
            {numberOfBlogs > 0 ? (
              <div
                className={clsx(
                  'grid grid-cols-1 gap-4 p-2',
                  numberOfBlogs > 1 && 'lg:grid-cols-2'
                )}
              >
                {data.map((group, i) => (
                  <React.Fragment key={i}>
                    {group.blogs.map((blog) => (
                      <BlogCard key={blog._id} blog={blog} />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <h2 className="text-center text-2xl">
                There are no blogs... Be the first to create!
              </h2>
            )}
          </div>
        )}

        {numberOfBlogs > 0 && canFetchMore ? (
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
