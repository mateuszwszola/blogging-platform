import React, { useState, lazy } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useUser } from 'context/UserContext';
import { useAlert } from 'context/AlertContext';
import { usePostBySlug, useDeletePost } from 'hooks/usePost';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import DisplayPost from 'components/layout/DisplayPost';
import isUserPostOwner from 'utils/isUserPostOwner';

const PostControllers = lazy(() => import('components/layout/PostControllers'));

const EditPost = lazy(() => import('./auth/EditPost'));

function Post() {
  const { postSlug } = useParams();
  const { status, error, data: post } = usePostBySlug(postSlug);
  const [deletePost] = useDeletePost();
  const history = useHistory();
  const { user } = useUser();
  const { setAlert } = useAlert();
  const [isEditting, setIsEditting] = useState(false);

  const onUpdatePost = () => {
    setIsEditting(false);
  };

  const handleDeletePost = () => {
    if (!isUserPostOwner(user, post)) return;

    deletePost(post._id, {
      onSuccess: () => {
        setAlert('success', 'Post Deleted');
        history.push('/');
      },
      onError: () => {
        setAlert('error', 'Cannot delete a post');
      },
    });
  };

  if (status === 'loading') {
    return <Loading />;
  }

  if (error) {
    return <DisplayError msg={error.message} />;
  }

  const isOwner = isUserPostOwner(user, post);

  return (
    <div className="mt-16 md:pt-16 pb-16 max-w-screen-md lg:max-w-screen-lg w-full mx-auto">
      <React.Suspense fallback={<Loading />}>
        {isOwner ? (
          <PostControllers
            isEditting={isEditting}
            setIsEditting={setIsEditting}
            handleDeletePost={handleDeletePost}
          />
        ) : null}

        {isEditting && isOwner ? (
          <EditPost post={post} onUpdatePost={onUpdatePost} />
        ) : (
          <DisplayPost post={post} />
        )}
      </React.Suspense>
    </div>
  );
}

export default Post;
