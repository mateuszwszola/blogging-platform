import api from './api';

function getBlogPosts(blogId) {
  return api(`posts/blog/${blogId}`);
}

export { getBlogPosts };