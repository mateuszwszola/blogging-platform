import React from 'react';
import { useAllBlogs } from 'hooks/useBlog';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import BlogCard from 'components/layout/BlogCard';

function Explore() {
  const [blogs, loading, error] = useAllBlogs();

  return (
    <div className="mt-16 md:mt-6 md:pt-16 pb-16 max-w-screen-xl mx-auto w-full">
      <h1 className="text-3xl text-center leading-loose">Explore Blogs</h1>

      <div className="px-2 py-2 mt-6 w-full">
        {error ? (
          <DisplayError msg="There was a problem with fetching the blogs" />
        ) : loading ? (
          <Loading />
        ) : (
          <div className="flex flex-wrap justify-center">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
