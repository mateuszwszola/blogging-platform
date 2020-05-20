import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory, Link } from 'react-router-dom';
import { deleteBlog } from 'api/blog';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import { useAlert } from 'context/AlertContext';
import AddBlogPost from './AddBlogPost';
import { useBlogBySlug } from 'hooks/useBlog';

function ManageBlog() {
  const { blogSlug } = useParams();
  const { status, data: blog, error } = useBlogBySlug(blogSlug);
  const { setAlert } = useAlert();
  const history = useHistory();

  function handleDeleteBlog() {
    if (!blog) return;

    deleteBlog(blog._id)
      .then(() => {
        // removeBlog(blog._id);
        setAlert('success', 'Blog deleted');
        history.push('/dashboard');
      })
      .catch((err) => {
        setAlert('error', 'Cannot delete a blog', 2000);
      });
  }

  return (
    <>
      {status === 'loading' ? (
        <Loading />
      ) : error ? (
        <DisplayError msg={error.message} />
      ) : (
        <>
          <div className="w-full flex justify-end">
            <Link
              to={`/blogs/${blogSlug}`}
              className="shadow bg-blue-500 rounded py-1 px-2 font-semibold text-blue-100 m-2 hover:bg-blue-600"
            >
              Preview Blog
            </Link>
            <button
              onClick={handleDeleteBlog}
              className="shadow bg-red-500 rounded py-1 px-2 font-semibold text-red-100 m-2 hover:bg-red-600"
            >
              Delete Blog
            </button>
          </div>
          <AddBlogPost blog={blog} />
        </>
      )}
    </>
  );
}

export default ManageBlog;
