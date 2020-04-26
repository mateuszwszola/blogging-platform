import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useUser } from 'context/UserContext';
import { useAlert } from 'context/AlertContext';
import { usePostBySlug } from 'hooks/usePost';
import { deletePost } from 'api/post';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import DisplayPost from 'components/layout/DisplayPost';

const PostControllers = React.lazy(() =>
  import('components/layout/PostControllers')
);

const EditPost = React.lazy(() => import('./auth/EditPost'));

const isUserPostOwner = (user, post) => {
  let isOwner = false;
  if (post && user) {
    if (post.user && typeof post.user === 'string') {
      if (post.user === user._id) {
        isOwner = true;
      }
    } else if (post.user && post.user._id === user._id) {
      isOwner = true;
    }
  }

  return isOwner;
};

function Post(props) {
  const { postSlug } = useParams();
  const history = useHistory();
  const user = useUser();
  const { setAlert } = useAlert();
  const [post, loading, error, updatePost] = usePostBySlug(postSlug);
  const [isEditting, setIsEditting] = React.useState(false);

  function onUpdatePost(updatedPost) {
    updatePost(updatedPost);
    setIsEditting(false);
  }

  function handleDeletePost() {
    if (!isUserPostOwner(user, post)) return;

    deletePost(post._id)
      .then((res) => {
        setAlert('success', 'Post Deleted');
        history.push('/');
      })
      .catch((err) => {
        console.error(err);
        setAlert(
          'error',
          'There was a problem with the server. Cannot delete a post'
        );
      });
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <DisplayError />;
  }

  const isOwner = isUserPostOwner(user, post);

  return (
    <div className="mt-16 md:pt-16 pb-16 max-w-screen-md lg:max-w-screen-lg w-full mx-auto">
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
    </div>
  );
}

export default Post;
