import { LOADING, RESPONSE_COMPLETE, ERROR } from './types';
import { getBlogBySlugName } from 'api/blog';

export const fetchBlogBySlug = (dispatch, slug) => {
  dispatch({ type: LOADING });

  getBlogBySlugName(slug)
    .then((response) => {
      dispatch({ type: RESPONSE_COMPLETE, payload: { blog: response.blog } });
    })
    .catch((error) => {
      dispatch({ type: ERROR, payload: { error } });
    });
};
