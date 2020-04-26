import { LOADING, RESPONSE_COMPLETE, ERROR } from 'actions/types';

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
  return state;
};
