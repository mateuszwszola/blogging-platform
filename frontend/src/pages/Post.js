import React, { useState, lazy, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useUser } from 'context/UserContext';
import { useAlert } from 'context/AlertContext';
import { usePost } from 'hooks/usePost';
import { deletePost } from 'api/post';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import DisplayPost from 'components/layout/DisplayPost';
import isUserPostOwner from 'utils/isUserPostOwner';
import { fetchPostBySlug } from 'actions/postActions';

const PostControllers = lazy(() => import('components/layout/PostControllers'));

const EditPost = lazy(() => import('./auth/EditPost'));

function Post(props) {
  const { postSlug } = useParams();
  const history = useHistory();
  const { user } = useUser();
  const { setAlert } = useAlert();
  const { post, loading, error, dispatch } = usePost();
  const [isEditting, setIsEditting] = useState(false);

  useEffect(() => {
    if (!postSlug) return;
    dispatch(fetchPostBySlug(postSlug));
  }, [postSlug, dispatch]);

  const onUpdatePost = () => {
    dispatch(fetchPostBySlug(postSlug));
    setIsEditting(false);
  };

  const handleDeletePost = () => {
    if (!isUserPostOwner(user, post)) return;

    deletePost(post._id)
      .then((res) => {
        setAlert('success', 'Post Deleted');
        history.push('/');
      })
      .catch((err) => {
        console.error(err);
        setAlert('error', 'Cannot delete a post');
      });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <DisplayError />;
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
