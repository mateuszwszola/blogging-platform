import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useBlog } from 'hooks/useBlog';
import { deleteBlog } from 'api/blog';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import { useAlert } from 'context/AlertContext';
import AddBlogPost from './AddBlogPost';
import { fetchBlogBySlug } from 'actions/blogActions';

function ManageBlog({ removeBlog }) {
  const { blogSlug } = useParams();
  const { blog, loading, error, dispatch } = useBlog();
  const { setAlert } = useAlert();
  const history = useHistory();

  useEffect(() => {
    dispatch(fetchBlogBySlug(blogSlug));
  }, [blogSlug, dispatch]);

  function handleDeleteBlog() {
    if (!blog) return;

    deleteBlog(blog._id)
      .then(() => {
        removeBlog(blog._id);
        setAlert('success', 'Blog deleted');
        history.push('/dashboard');
      })
      .catch((err) => {
        setAlert('error', 'Cannot delete a blog', 2000);
      });
  }

  return (
    <>
      {error ? (
        <DisplayError />
      ) : loading ? (
        <Loading />
      ) : (
        <>
          <div className="w-full flex justify-end">
            <Link
              to={`/blogs/${blog.slug}`}
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

ManageBlog.propTypes = {
  removeBlog: PropTypes.func.isRequired,
};

export default ManageBlog;
