import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import profileImg from '../../img/undraw_profile.svg';
import { useAllBlogs } from '../../hooks/useBlog';

function Explore({ blogs, status, ...props }) {
  return (
    <div className="md:pt-16 pb-16 max-w-screen-xl mx-auto mt-6">
      <h1 className="text-3xl text-center leading-loose">Explore Blogs</h1>

      <div className="px-4 py-2 mt-6 flex justify-center">
        <div className="flex flex-wrap">
          {status === 'loading' ? (
            <div>Loading...</div>
          ) : (
            <>
              {blogs.map(blog => (
                <div
                  key={blog._id}
                  className="w-64 m-2 bg-gray-200 shadow py-4 px-2 rounded flex flex-col justify-between"
                >
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-blue-700 hover:text-gray-800 text-2xl font-medium">
                      <Link to={`/blogs/${blog.slug}`}>{blog.name}</Link>
                    </h3>
                    {blog.description && (
                      <p className="text-gray-800">{blog.description}</p>
                    )}
                  </div>

                  <div className="flex items-center mt-5">
                    <img
                      src={profileImg}
                      alt="profile"
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="ml-4">
                      <h4 className="text-md font-medium cursor-pointer text-blue-700 hover:text-gray-800">
                        {blog.user.name}
                      </h4>
                      {blog.user.bio && (
                        <p className="text-sm text-gray-600">{blog.user.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Explore.propTypes = {
  blogs: PropTypes.array,
  status: PropTypes.string.isRequired
};

function ExploreContainer() {
  const [blogs, status] = useAllBlogs();

  return (
    <Explore blogs={blogs} status={status} />
  );
}

export default ExploreContainer;
