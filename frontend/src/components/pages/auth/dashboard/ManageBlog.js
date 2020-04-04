import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory, Link } from 'react-router-dom';
import AddBlogPost from './AddBlogPost';
import { useBlogBySlugName } from '../../../../hooks/useBlog';
import { deleteBlog } from '../../../../api/blog';
import Loading from '../../../Loading';
import { useAlert } from '../../../../context/AlertContext';

function ManageBlog({ blog, handleDeleteBlog, ...props }) {
  return (
    <>
      <div className="w-full flex justify-end">
        <Link
          to={`/blogs/${blog.slug}`}
          className="bg-blue-500 rounded py-2 px-4 font-semibold text-blue-100 m-2 hover:bg-blue-600"
        >
          Preview Blog
        </Link>
        <button
          onClick={handleDeleteBlog}
          className="bg-red-500 rounded py-2 px-4 font-semibold text-red-100 m-2 hover:bg-red-600"
        >
          Delete Blog
        </button>
      </div>
      <AddBlogPost blog={blog} />
    </>
  );
}

ManageBlog.propTypes = {
  blog: PropTypes.object,
  handleDeleteBlog: PropTypes.func.isRequired,
};

function ManageBlogContainer({ reloadBlogs }) {
  const { blogSlug } = useParams();
  const [blog, status] = useBlogBySlugName(blogSlug);
  const { setAlert } = useAlert();
  let history = useHistory();

  function handleDeleteBlog() {
    if (!blog) return;

    function onDelete() {
      reloadBlogs();
      setAlert('success', 'Blog deleted');
      history.push('/dashboard');
    }

    function onError(err) {
      console.error(err);
      setAlert(
        'error',
        'There was a problem with the server. Cannot delete a blog',
        3000
      );
    }

    deleteBlog(blog._id).then(onDelete).catch(onError);
  }

  if (status === 'loading' || !blog) {
    return <Loading />;
  }

  return <ManageBlog handleDeleteBlog={handleDeleteBlog} blog={blog} />;
}

ManageBlogContainer.propTypes = {
  reloadBlogs: PropTypes.func.isRequired,
};

export default ManageBlogContainer;
