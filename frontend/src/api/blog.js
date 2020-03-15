import api from './api';

function getBlogBySlugName(slug) {
  return api(`blogs/slug/${slug}`);
}

export { getBlogBySlugName };