import { useState, useEffect } from 'react';
import * as postAPI from 'api/post';
import useThunkReducer from './useThunkReducer';
import { fetchBlogPosts, fetchPostBySlug } from 'actions/postActions';
import { postsReducer, postReducer } from 'reducers/postReducer';
import { UPDATE_POST } from 'actions/types';

const initialPostsState = {
  posts: [],
  loading: true,
  error: null,
};

const initialPostState = {
  post: {},
  loading: true,
  error: null,
};

function useBlogPosts(blogId) {
  const [state, dispatch] = useThunkReducer(postsReducer, initialPostsState);

  useEffect(() => {
    if (!blogId) return;

    dispatch(() => {
      fetchBlogPosts(dispatch, blogId);
    });
  }, [dispatch, blogId]);

  return [state.posts, state.loading, state.error];
}

function usePostBySlug(slug) {
  const [state, dispatch] = useThunkReducer(postReducer, initialPostState);

  const updatePost = (updatedPost) => {
    dispatch({ type: UPDATE_POST, payload: { post: updatedPost } });
  };

  useEffect(() => {
    if (!slug) return;

    dispatch(() => {
      fetchPostBySlug(dispatch, slug);
    });
  }, [dispatch, slug]);

  return [state.post, state.loading, state.error, updatePost];
}

function useUserPosts() {
  const [posts, setPosts] = useState(null);
  const [status, setStatus] = useState('loading');

  function reloadPosts() {
    setStatus('loading');
  }

  useEffect(() => {
    function getPosts() {
      postAPI
        .getUserPosts()
        .then((res) => {
          setPosts(res.posts);
          setStatus('loaded');
        })
        .catch((err) => {
          console.error(err);
          setStatus('error');
        });
    }
    let canceled = false;

    if (!canceled && status === 'loading') {
      getPosts();
    }

    return () => (canceled = true);
  }, [status]);

  return [posts, status, reloadPosts];
}

export { useBlogPosts, usePostBySlug, useUserPosts };
