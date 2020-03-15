import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useBlogBySlugName } from '../../hooks/useBlog';
import { useBlogPosts } from '../../hooks/usePost';
import Posts from '../Posts';

function Blog({ blog, ...props }) {
  const [posts, status] = useBlogPosts(blog._id);

  return (
    <div className="mt-16">
      <h1>{blog.name}</h1>
      {status === 'loading' ? (
        <div>Loading...</div>
      ) : (
        <Posts posts={posts} />
      )}
    </div>
  );
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

function BlogContainer(props) {
  const { blogSlug } = useParams();
  const [blog, status] = useBlogBySlugName(blogSlug);
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>There is a problem with the server. Try reload the page</div>;
  }

  return <Blog blog={blog} />;
}

export default BlogContainer;
