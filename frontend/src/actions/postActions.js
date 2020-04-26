import { LOADING, RESPONSE_COMPLETE, ERROR } from './types';
import { getBlogPosts, getPostBySlug } from 'api/post';

export const fetchBlogPosts = (dispatch, blogId) => {
  dispatch({ type: LOADING });

  getBlogPosts(blogId)
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { posts: response.posts } });
    })
    .catch((error) => dispatch({ type: ERROR, payload: { error } }));
};

export const fetchPostBySlug = (dispatch, slug) => {
  dispatch({ type: LOADING });

  getPostBySlug(slug)
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { post: response.post } });
    })
    .catch((error) => dispatch({ type: ERROR, payload: { error } }));
};
