import {
  LOADING,
  RESPONSE_COMPLETE,
  ERROR,
  SET_BLOG,
  REMOVE_BLOG,
} from 'actions/types';

export const blogsReducer = (state, action) => {
  if (action.type === LOADING) {
    return {
      blogs: [],
      loading: true,
      error: null,
    };
  }
  if (action.type === RESPONSE_COMPLETE) {
    return {
      blogs: action.payload.blogs,
      loading: false,
      error: null,
    };
  }
  if (action.type === ERROR) {
    return {
      blogs: [],
      loading: false,
      error: action.type.error,
    };
  }
  if (action.type === SET_BLOG) {
    return {
      ...state,
      blogs: [action.payload.blog, ...state.blogs],
    };
  }
  if (action.type === REMOVE_BLOG) {
    return {
      ...state,
      blogs: state.blogs.filter((blog) => blog._id !== action.payload.blogId),
    };
  }
  return state;
};

export const blogReducer = (state, action) => {
  if (action.type === LOADING) {
    return {
      blog: {},
      loading: true,
      error: null,
    };
  }
  if (action.type === RESPONSE_COMPLETE) {
    return {
      blog: action.payload.blog,
      loading: false,
      error: null,
    };
  }
  if (action.type === ERROR) {
    return {
      blog: {},
      loading: false,
      error: action.type.error,
    };
  }
  if (action.type === SET_BLOG) {
    return {
      ...state,
      blog: action.payload.blog,
    };
  }
  if (action.type === REMOVE_BLOG) {
    return {
      ...state,
      blog: {},
    };
  }
  return state;
};
