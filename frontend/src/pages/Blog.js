import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useBlogBySlugName } from 'hooks/useBlog';
import { useBlogPosts } from 'hooks/usePost';
import Posts from 'components/Posts';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';

function Blog({ blog, ...props }) {
  const [posts, status] = useBlogPosts(blog._id);

  return (
    <div>
      <div
        className="w-full min-h-screen relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            blog.bgImg ? blog.bgImg : 'https://picsum.photos/1280/720'
          })`,
        }}
      >
        <div
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          className="w-full h-full absolute top-0 left-0 bottom-0 right-0"
        >
          <div className="h-full flex flex-col justify-center items-center px-2">
            <img src="" alt="" />
            <h1 className="text-3xl xl:text-4xl text-center leading-loose my-2 text-gray-100">
              {blog.name}
            </h1>
            {blog.description && (
              <p className="text-center text-lg uppercase text-gray-200">
                {blog.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="py-16">
        {status === 'loading' ? (
          <Loading />
        ) : (
          <>
            {posts && posts.length > 0 ? (
              <Posts posts={posts} />
            ) : (
              <h2 className="text-center text-2xl uppercase font-semibold">
                No Blog Posts
              </h2>
            )}
          </>
        )}
      </div>
    </div>
  );
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

function BlogContainer(props) {
  const { blogSlug } = useParams();
  const [blog, status] = useBlogBySlugName(blogSlug);

  if (status === 'loading' || !blog) {
    return <Loading />;
  }

  if (status === 'error') {
    return <DisplayError />;
  }

  return <Blog blog={blog} />;
}

export default BlogContainer;
