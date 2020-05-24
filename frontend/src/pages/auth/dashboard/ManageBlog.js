import React from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useAlert } from 'context/AlertContext';
import { useBlogBySlug, useDeleteBlog } from 'hooks/useBlog';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import AddBlogPost from './AddBlogPost';

function ManageBlog() {
  const { blogSlug } = useParams();
  const { status, data: blog, error: blogError } = useBlogBySlug(blogSlug);
  const [
    deleteBlog,
    { status: deleteStatus, error: deleteError },
  ] = useDeleteBlog();
  const { setAlert } = useAlert();
  const history = useHistory();

  function handleDeleteBlog() {
    if (!blog) return;

    deleteBlog(blog._id, {
      onSuccess: () => {
        setAlert('success', 'Blog deleted');
        history.push('/dashboard');
      },
      onError: () => {
        setAlert('error', 'Cannot delete a blog', 2000);
      },
    });
  }

  return (
    <>
      {status === 'loading' || deleteStatus === 'loading' ? (
        <Loading />
      ) : blogError ? (
        <DisplayError
          msg={blogError.message || 'There were a problem loading blog'}
        />
      ) : (
        <>
          <div className="w-full flex justify-end">
            {deleteError && (
              <DisplayError
                msg={
                  deleteError.message || 'There were a problem deleting blog'
                }
              />
            )}
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
