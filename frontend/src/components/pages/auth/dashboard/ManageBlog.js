import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import AddBlogPost from './AddBlogPost';
import { useBlogBySlugName } from '../../../../hooks/useBlog';
import { deleteBlog } from '../../../../api/blog';
import Loading from '../../../Loading';

function ManageBlog({ blog, handleDeleteBlog, ...props }) {
  return (
    <>
      <div className="w-full flex justify-end">
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
  handleDeleteBlog: PropTypes.func.isRequired
};

function ManageBlogContainer({ reloadBlogs }) {
  const { blogSlug } = useParams();
  const [blog, status] = useBlogBySlugName(blogSlug);
  let history = useHistory();

  function handleDeleteBlog() {
    if (blog) {
      deleteBlog(blog._id)
        .then(res => {
          reloadBlogs();
          history.push('/dashboard');
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  if (status === 'loading' || !blog) {
    return <Loading />;
  }

  return <ManageBlog handleDeleteBlog={handleDeleteBlog} blog={blog} />;
}

ManageBlogContainer.propTypes = {
  reloadBlogs: PropTypes.func.isRequired
};

export default ManageBlogContainer;
