import client from './client';

function getBlogBySlugName(slug) {
  return client(`blogs/slug/${slug}`);
}

function getAllBlogs() {
  return client('blogs/all');
}

function getUserBlogs() {
  return client('blogs');
}

function createBlog(data) {
  return client('blogs', { body: data });
}

function deleteBlog(blogId) {
  return client(`blogs/${blogId}`, { method: 'DELETE' });
}

export { getBlogBySlugName, getAllBlogs, getUserBlogs, createBlog, deleteBlog };
