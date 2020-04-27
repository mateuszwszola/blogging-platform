import { useEffect, useCallback } from 'react';
import useThunkReducer from './useThunkReducer';
import {
  fetchBlogPosts,
  fetchPostBySlug,
  fetchUserPosts,
} from 'actions/postActions';
import { postsReducer, postReducer } from 'reducers/postReducer';
import { SET_POST } from 'actions/types';

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

  const setPost = (updatedPost) => {
    dispatch({ type: SET_POST, payload: { post: updatedPost } });
  };

  useEffect(() => {
    if (!slug) return;

    dispatch(() => {
      fetchPostBySlug(dispatch, slug);
    });
  }, [dispatch, slug]);

  return [state.post, state.loading, state.error, setPost];
}

function useUserPosts() {
  const [state, dispatch] = useThunkReducer(postsReducer, initialPostsState);

  const getPosts = useCallback(() => {
    fetchUserPosts(dispatch);
  }, [dispatch]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return [state.posts, state.loading, state.error];
}

export { useBlogPosts, usePostBySlug, useUserPosts };
