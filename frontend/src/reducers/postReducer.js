import { LOADING, RESPONSE_COMPLETE, ERROR } from 'actions/types';

export const SET_POST = 'SET_POST';
export const REMOVE_POST = 'REMOVE_POST';

export const initialPostsState = {
  posts: [],
  loading: true,
  error: null,
};

export const initialPostState = {
  post: {},
  loading: true,
  error: null,
};

export const postsReducer = (state, action) => {
  if (action.type === LOADING) {
    return {
      posts: [],
      error: null,
      loading: true,
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
      loading: false,
      error: null,
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
      loading: false,
      error: null,
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
      loading: false,
      error: null,
      post: action.payload.post,
    };
  }
  if (action.type === REMOVE_POST) {
    return {
      loading: false,
      error: null,
      post: {},
    };
  }
  return state;
};
