import React, { useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useAlert } from 'context/AlertContext';
import { useBlogBySlug, useDeleteBlog } from 'hooks/useBlog';
import AddBlogPost from 'pages/auth/dashboard/AddBlogPost';
import UpdateBlog from 'pages/auth/dashboard/UpdateBlog';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import Button from 'components/Button';

function ManageBlog() {
  const { blogSlug } = useParams();
  const { status, data: blog, error: blogError } = useBlogBySlug(blogSlug);
  const [
    deleteBlog,
    { status: deleteStatus, error: deleteError },
  ] = useDeleteBlog();
  const { setAlert } = useAlert();
  const history = useHistory();
  const [isEditting, setIsEditting] = useState(false);

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
              {isEditting ? (
                <Button version="edit" onClick={() => setIsEditting(false)}>
                  Cancel Editting
                </Button>
              ) : (
                <Button version="edit" onClick={() => setIsEditting(true)}>
                  Edit Blog
                </Button>
              )}
            </div>
            <div className="inline-block m-2">
              <Button version="delete" onClick={handleDeleteBlog}>
                Delete Blog
              </Button>
            </div>
          </div>

          {isEditting ? (
            <UpdateBlog blog={blog} onUpdate={() => setIsEditting(false)} />
          ) : (
            <AddBlogPost blog={blog} />
          )}
        </>
      )}
    </>
  );
}

export default ManageBlog;
