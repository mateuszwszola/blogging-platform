import React from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useAlert } from 'context/AlertContext';
import { useBlogBySlug, useDeleteBlog } from 'hooks/useBlog';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import AddBlogPost from './AddBlogPost';
import { Button } from 'components/layout/Button';

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
          {deleteError && (
            <DisplayError
              msg={deleteError.message || 'There were a problem deleting blog'}
            />
          )}
          <div className="w-full flex justify-center md:justify-end">
            <Link to={`/blogs/${blogSlug}`} className="block m-2">
              <Button version="secondary">Preview Blog</Button>
            </Link>
            <div className="inline-block m-2">
              <Button version="delete" onClick={handleDeleteBlog}>
                Delete Blog
              </Button>
            </div>
          </div>
          <AddBlogPost blog={blog} />
        </>
      )}
    </>
  );
}

export default ManageBlog;
