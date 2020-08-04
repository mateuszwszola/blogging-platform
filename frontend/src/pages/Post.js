import React, { useState, lazy } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useUser } from 'context/UserContext';
import { useAlert } from 'context/AlertContext';
import {
  usePostBySlug,
  useDeletePost,
  useFavoritePost,
  useUnfavoritePost,
} from 'hooks/usePost';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import DisplayPost from 'components/DisplayPost';
import isUserPostOwner from 'utils/isUserPostOwner';

const Controllers = lazy(() => import('pages/post/Controllers'));
const EditPost = lazy(() => import('pages/post/EditPost'));

function Post() {
  const { postSlug } = useParams();
  const history = useHistory();
  const { user } = useUser();
  const { setAlert } = useAlert();
  const { status, error, data: post } = usePostBySlug(postSlug);
  const [deletePost] = useDeletePost();
  const [favoritePost] = useFavoritePost();
  const [unfavoritePost] = useUnfavoritePost();
  const [isEditting, setIsEditting] = useState(false);

  const onLike = () => {
    if (!post || !user) return;
    if (post.favorited) {
      return unfavoritePost(postSlug);
    } else {
      return favoritePost(postSlug);
    }
  };

  const onUpdatePost = () => {
    setIsEditting(false);
  };

  const handlePostDelete = () => {
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
          <Controllers
            isEditting={isEditting}
            setIsEditting={setIsEditting}
            handlePostDelete={handlePostDelete}
          />
        ) : null}

        {isEditting && isOwner ? (
          <EditPost post={post} onUpdatePost={onUpdatePost} />
        ) : (
          <DisplayPost post={post} onLike={onLike} />
        )}
      </React.Suspense>
    </div>
  );
}

export default Post;
