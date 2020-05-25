import { RESPONSE_COMPLETE } from './types';
import { setError, setLoading } from './actionsCreators';
import { getBlogPosts, getPostBySlug, getAuthUserPosts } from 'api/post';

export const fetchBlogPosts = (blogId) => (dispatch) => {
  dispatch(setLoading());

  getBlogPosts(blogId)
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { posts: response.posts } });
    })
    .catch((error) => dispatch(setError(error)));
};

export const fetchPostBySlug = (slug) => (dispatch) => {
  dispatch(setLoading());

  getPostBySlug(slug)
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { post: response.post } });
    })
    .catch((error) => dispatch(setError(error)));
};

export const fetchUserPosts = () => (dispatch) => {
  dispatch(setLoading());

  getAuthUserPosts()
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { posts: response.posts } });
    })
    .catch((error) => dispatch(setError(error)));
};
