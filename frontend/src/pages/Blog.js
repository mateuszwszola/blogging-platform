import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useBlogBySlug } from 'hooks/useBlog';
import { useBlogPosts } from 'hooks/usePost';
import Posts from 'components/Posts';
import Loading from 'components/Loading';
import DisplayError from 'components/DisplayError';

function Blog() {
  const { blogSlug } = useParams();
  const { status: blogStatus, data: blog, error: blogError } = useBlogBySlug(
    blogSlug
  );
  const { status: postsStatus, data: posts, error: postsError } = useBlogPosts(
    blog && blog._id
  );

  if (blogStatus === 'loading') {
    return <Loading />;
  }

  if (blogError) {
    return (
      <DisplayError
        msg={blogError.message || 'There was a problem fetching a blog'}
      />
    );
  }

  const photoSrc =
    (blog.bgImg && blog.bgImg.large_image_url) ||
    'https://picsum.photos/1280/720';

  return (
    <div className="py-16">
      <div
        className="w-full relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${photoSrc})`,
          height: '70vh',
        }}
      >
        <div className="w-full h-full absolute top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50">
          <div className="h-full flex flex-col justify-center items-center px-2">
            <h1 className="text-4xl lg:text-6xl text-center leading-loose my-2 text-white">
              {blog.name}
            </h1>
            {blog.description && (
              <p className="text-center text-xl text-white rounded py-1 px-2">
                {blog.description}
              </p>
            )}
          </div>
        </div>
        <div className="hidden md:block w-64 absolute bottom-0 right-0 transform translate-y-1/2 -translate-x-8 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col items-center p-5">
            {blog.user.avatar?.image_url && (
              <img
                src={blog.user.avatar.image_url}
                className="rounded-full w-40 h-40"
                alt=""
              />
            )}
            <h3 className="mt-2 text-2xl text-center font-semibold text-gray-800">
              {blog.user.name}
            </h3>
            <Link
              to={`/profile/${blog.user._id}`}
              className="block mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow focus:outline-none focus:shadow-outline transition duration-100 px-4 py-2 test-base"
            >
              View profile
            </Link>
          </div>
        </div>
      </div>

      <div className="md:hidden mx-auto mt-8 w-64 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center p-5">
          {blog.user.avatar?.image_url && (
            <img
              src={blog.user.avatar.image_url}
              className="rounded-full w-40 h-40"
              alt=""
            />
          )}
          <h3 className="mt-2 text-2xl text-center font-semibold text-gray-800">
            {blog.user.name}
          </h3>
          <Link
            to={`/profile/${blog.user._id}`}
            className="block mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow focus:outline-none focus:shadow-outline transition duration-100 px-4 py-2 test-base"
          >
            View profile
          </Link>
        </div>
      </div>

      <div className="py-16 w-full max-w-screen-xl mx-auto md:mt-32">
        {postsStatus === 'loading' ? (
          <Loading />
        ) : postsStatus === 'error' ? (
          <DisplayError
            msg={
              postsError.message ||
              'There was a problem with fetching the posts'
            }
          />
        ) : (
          <Posts posts={posts} />
        )}
      </div>
    </div>
  );
}

export default Blog;
