import { LOADING, RESPONSE_COMPLETE, ERROR } from './types';
import { getBlogPosts, getPostBySlug, getUserPosts } from 'api/post';

export const fetchBlogPosts = (dispatch, blogId) => {
  dispatch(setLoading());

  getBlogPosts(blogId)
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { posts: response.posts } });
    })
    .catch((error) => dispatch(setError(error)));
};

export const fetchPostBySlug = (dispatch, slug) => {
  dispatch(setLoading());

  getPostBySlug(slug)
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { post: response.post } });
    })
    .catch((error) => dispatch(setError(error)));
};

export const fetchUserPosts = (dispatch) => {
  dispatch(setLoading());

  getUserPosts()
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { posts: response.posts } });
    })
    .catch((error) => dispatch(setError(error)));
};

export const setError = (error) => ({
  type: ERROR,
  payload: { error },
});

export const setLoading = () => ({
  type: LOADING,
});
