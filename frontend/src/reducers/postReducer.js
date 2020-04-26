import { LOADING, RESPONSE_COMPLETE, ERROR, UPDATE_POST } from 'actions/types';

export const postsReducer = (state, action) => {
  if (action.type === LOADING) {
    return {
      posts: [],
      loading: true,
      error: null,
    };
  }
  if (action.type === RESPONSE_COMPLETE) {
    return {
      posts: action.payload.posts,
      loading: false,
      error: null,
    };
  }
  if (action.type === ERROR) {
    return {
      posts: [],
      loading: false,
      error: action.type.error,
    };
  }
  return state;
};

export const postReducer = (state, action) => {
  if (action.type === LOADING) {
    return {
      post: {},
      loading: true,
      error: null,
    };
  }
  if (action.type === RESPONSE_COMPLETE) {
    return {
      post: action.payload.post,
      loading: false,
      error: null,
    };
  }
  if (action.type === ERROR) {
    return {
      post: {},
      loading: false,
      error: action.type.error,
    };
  }
  if (action.type === UPDATE_POST) {
    return {
      post: action.payload.post,
      loading: false,
      error: null,
    };
  }
  return state;
};
