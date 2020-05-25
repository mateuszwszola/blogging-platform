import client from './client';

function getBlogBySlugName(slug) {
  return client(`blogs/slug/${slug}`);
}

function getAllBlogs() {
  return client('blogs/all');
}

function getUserBlogs(userId) {
  return client(`blogs/user/${userId}`);
}

function createBlog(data) {
  return client('blogs', data);
}

function deleteBlog(blogId) {
  return client(`blogs/${blogId}`, { method: 'DELETE' });
}

export { getBlogBySlugName, getAllBlogs, getUserBlogs, createBlog, deleteBlog };
