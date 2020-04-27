import {
  LOADING,
  RESPONSE_COMPLETE,
  ERROR,
  SET_POST,
  REMOVE_POST,
} from 'actions/types';

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
  if (action.type === SET_POST) {
    return {
      ...state,
      posts: state.posts.map((post) => {
        if (post._id !== action.payload.postId) return post;
        return {
          ...action.payload.post,
        };
      }),
    };
  }
  if (action.type === REMOVE_POST) {
    return {
      ...state,
      posts: state.posts.filter((post) => post._id !== action.payload.postId),
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
  if (action.type === SET_POST) {
    return {
      ...state,
      post: action.payload.post,
    };
  }
  if (action.type === REMOVE_POST) {
    return {
      ...state,
      post: {},
    };
  }
  return state;
};
