import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import BlogCard from 'components/BlogCard';

function Blogs({ blogs }) {
  return (
    <div
      className={clsx(
        'grid grid-cols-1 gap-4 p-2',
        blogs.length > 1 && 'lg:grid-cols-2'
      )}
    >
      {blogs.length === 0 ? (
        <h2 className="text-center text-2xl">There are no blogs</h2>
      ) : (
        blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
      )}
    </div>
  );
}

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
};

export default Blogs;
