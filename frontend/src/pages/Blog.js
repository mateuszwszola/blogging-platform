import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useBlogBySlugName } from 'hooks/useBlog';
import useAsync from 'hooks/useAsync';
// import { useBlogPosts } from 'hooks/usePost';
import { getBlogPosts } from 'api/post';

import Posts from 'components/Posts';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';
import { API_BASE_URL } from 'api/client';

const formatData = (result) => result.posts;

function Blog({ blog }) {
  // const [posts, loading, error] = useBlogPosts(blog._id);
  const { loading, error, result: posts } = useAsync({
    promiseFn: getBlogPosts,
    immediate: true,
    data: blog._id,
    formatData,
  });

  return (
    <>
      <div
        className="w-full min-h-screen relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            blog.photo
              ? `${API_BASE_URL}/photos/${blog.photo}`
              : blog.bgImgUrl
              ? blog.bgImgUrl
              : 'https://picsum.photos/1280/720'
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
        {error ? (
          <DisplayError msg="There was a problem with fetching the posts" />
        ) : loading ? (
          <Loading />
        ) : (
          <Posts posts={posts} />
        )}
      </div>
    </>
  );
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

function BlogContainer(props) {
  const { blogSlug } = useParams();
  const [blog, loading, error] = useBlogBySlugName(blogSlug);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <DisplayError msg="There was a problem fetching a blog" />;
  }

  return <Blog blog={blog} />;
}

export default BlogContainer;
