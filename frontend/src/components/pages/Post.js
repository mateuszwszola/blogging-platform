import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUser } from '../../context/UserContext';
import { useParams, useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import api from '../../api/api';
import profileImg from '../../img/undraw_profile.svg';

function Post({ post, isOwner, deletePost, ...props }) {
  return (
    <div className="mt-16 md:mt-6 md:pt-16 pb-16 max-w-screen-md w-full mx-auto">
      {isOwner && (
        <div className="w-full flex justify-end">
          <button
            onClick={deletePost}
            className="bg-red-500 rounded py-2 px-4 font-semibold text-red-100 m-2 hover:bg-red-600"
          >
            Delete Post
          </button>
        </div>
      )}
      <div className="">
        <div className="py-4 px-2">
          <div className="flex flex-col md:flex-row items-center">
            <p className="text-sm md:text-base text-gray-600 font-semibold tracking-wide">
              <Moment format="YYYY/MM/DD">{post.createdAt}</Moment>
            </p>
            {post.tags && post.tags.length > 0 && (
              <div>
                <span className="mx-2">/</span>
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-blue-700 uppercase text-sm md:text-base font-semibold mr-2"
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
          <div className="flex flex-col md:flex-row-reverse justify-end mt-2 items-center md:items-start">
            <h3 className="text-base text-gray-700 uppercase font-semibold mt-2 md:ml-4">
              {post.user.name}
            </h3>
            <img src={profileImg} alt="profile" className="w-16" />
          </div>
        </div>

        <div className="mt-3">
          <div className="">
            <img
              src="https://picsum.photos/seed/picsum/1280/720"
              className="max-w-full block mx-auto"
              alt="post-background"
            />
          </div>
          <div className="mt-2 mx-2 py-4">
            <p className="text-xl md:text-2xl leading-loose tracking-wide">
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
  deletePost: PropTypes.func.isRequired
};

function PostContainer(props) {
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading');
  const user = useUser();
  let history = useHistory();

  useEffect(() => {
    function getPost() {
      api(`posts/slug/${postSlug}`)
        .then(res => {
          setPost(res.post);
          setStatus('loaded');
        })
        .catch(err => {
          console.error(err);
          setStatus('error');
        });
    }
    let canceled = false;

    if (!canceled && status === 'loading') {
      getPost();
    }

    return () => (canceled = true);
  }, [status, postSlug]);

  function deletePost() {
    if (post && user && user._id === post.user._id) {
      api(`posts/${post._id}`, 'DELETE')
        .then(res => {
          history.push('/');
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>There is a problem with the server. Try reload the page</div>;
  }

  return (
    <Post
      post={post}
      isOwner={!!(user && user._id === post.user._id)}
      deletePost={deletePost}
    />
  );
}

export default PostContainer;
