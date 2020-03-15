import api from './api';

function getBlogBySlugName(slug) {
  return api(`blogs/slug/${slug}`);
}

function getAllBlogs() {
  return api('blogs/all');
}

function getUserBlogs() {
  return api('blogs');
}

function createBlog(data) {
  return api('blogs', 'POST', { body: data });
}

function deleteBlog(blogId) {
  return api(`blogs/${blogId}`, 'DELETE')
}

export { getBlogBySlugName, getAllBlogs, getUserBlogs, createBlog, deleteBlog };