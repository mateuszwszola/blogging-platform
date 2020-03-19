import React from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import { useUser } from '../../context/UserContext';
import profileImg from '../../img/undraw_profile.svg';
import { usePostBySlug } from '../../hooks/usePost';
import { deletePost } from '../../api/post';
import Loading from '../Loading';

function Post({ post, isOwner, handleDeletePost, ...props }) {
  return (
    <div className="mt-16 md:mt-6 md:pt-16 pb-16 max-w-screen-md w-full mx-auto">
      {isOwner && (
        <div className="w-full flex justify-end">
          <button
            onClick={handleDeletePost}
            className="bg-red-500 rounded py-2 px-4 font-semibold text-red-100 m-2 hover:bg-red-600"
          >
            Delete Post
          </button>
        </div>
      )}
      <div className="px-2 py-4">
        <div className="">
          <div className="flex flex-col md:flex-row items-center">
            <p className="text-sm sm:text-base text-gray-600 font-semibold tracking-wide">
              <Moment format="YYYY/MM/DD">{post.createdAt}</Moment>
            </p>
            {post.tags && post.tags.length > 0 && (
              <div className="py-2 md:py-0 text-center">
                <span className="hidden md:inline-block mx-2">/</span>
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-blue-700 uppercase text-sm md:text-base font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl capitalize text-center md:text-left font-semibold">
            {post.title}
          </h1>
          <div className="flex flex-col md:flex-row mt-2 items-center">
            <img src={profileImg} alt="profile" className="w-16" />
            <h3 className="text-base text-gray-700 uppercase font-semibold mt-2 md:ml-4">
              {post.user.name}
            </h3>
          </div>
        </div>

        <div className="mt-3">
          <div className="">
            <img
              src="https://picsum.photos/seed/picsum/1280/720"
              className="max-w-full block mx-auto rounded"
              alt="post-background"
            />
          </div>
          <div className="mt-2 py-4 px-2">
            <p className="text-lg md:text-xl lg:text-2xl leading-loose tracking-wide">
              {post.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired,
  handleDeletePost: PropTypes.func.isRequired
};

function PostContainer(props) {
  const { postSlug } = useParams();
  const user = useUser();
  let history = useHistory();
  const [post, status] = usePostBySlug(postSlug);

  function handleDeletePost() {
    if (post && user && user._id === post.user._id) {
      deletePost(post._id)
        .then(res => {
          history.push('/');
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  if (status === 'loading') {
    return <Loading />;
  }

  if (status === 'error') {
    return (
      <div className="mt-16">
        There is a problem with the server. Try reload the page
      </div>
    );
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
