import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

function Post({ post, isOwner, handleDeletePost, ...props }) {
  const [isEditting, setIsEditting] = useState(false);
  console.log(post);
  return (
    <div className="mt-16 md:mt-6 md:pt-16 pb-16 max-w-screen-md w-full mx-auto">
      {isOwner ? (
        <PostControllers
          isEditting={isEditting}
          setIsEditting={setIsEditting}
          handleDeletePost={handleDeletePost}
        />
      ) : null}

      {isEditting && isOwner ? (
        <EditPost post={post} />
      ) : (
        <DisplayPost post={post} />
      )}
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired,
  handleDeletePost: PropTypes.func.isRequired,
};

function PostContainer(props) {
  const { postSlug } = useParams();
  const history = useHistory();
  const user = useUser();
  const { setAlert } = useAlert();
  const [post, status] = usePostBySlug(postSlug);

  function handleDeletePost() {
    if (!(post && user && user._id === post.user._id)) return;

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

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return <DisplayError />;
  }

  return (
    <Post
      post={post}
      isOwner={!!(user && user._id === post.user._id)}
      handleDeletePost={handleDeletePost}
    />
  );
}

export default PostContainer;
