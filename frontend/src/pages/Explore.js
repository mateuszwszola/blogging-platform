import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useBlogs } from 'hooks/useBlog';
import { fetchAllBlogs } from 'actions/blogActions';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import BlogCard from 'components/layout/BlogCard';

function Explore() {
  const { blogs, loading, error, dispatch } = useBlogs();

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  return (
    <div className="py-16">
      <h1 className="text-3xl text-center leading-loose my-8">Explore Blogs</h1>

      <div className="px-2 py-2 mt-6 w-full">
        {error ? (
          <DisplayError msg="There was a problem with loading the blogs" />
        ) : loading ? (
          <Loading />
        ) : (
          <div className="">
            {blogs.length === 0 ? (
              <h2 className="text-center text-2xl uppercase font-semibold">
                There are no blogs. Be the first one!
              </h2>
            ) : (
              <div
                className={clsx(
                  'grid grid-cols-1 gap-4 p-2',
                  blogs.length > 1 && 'lg:grid-cols-2'
                )}
              >
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
