import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { CalendarIcon, StarFullIcon } from '../../../icons';
import { Link } from 'react-router-dom';
import api from '../../../api/api';

function Homepage({ posts, ...props }) {
  return (
    <div className="md:pt-16 pb-16 max-w-screen-xl mx-auto mt-6">
      <h1 className="text-3xl text-center leading-loose my-4">
        Your Blog posts
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2">
        {posts.map((post, index) => (
          <div
            key={post._id}
            className={`${index < posts.length - 1 && 'mb-20'}`}
          >
            <img
              src="https://picsum.photos/seed/picsum/600/300"
              alt=""
              className="max-w-full rounded"
            />
            <div className="pl-4">
              <div className="flex items-center my-2">
                <CalendarIcon className="w-6 h-6 fill-current text-gray-600" />
                <span className="text-gray-600 ml-2">
                  <Moment format="YYYY/MM/DD">{post.createdAt}</Moment>
                </span>
              </div>

              <h3 className="mt-2 text-2xl xl:text-3xl uppercase font-semibold cursor-pointer hover:underline text-gray-800">
                <Link to={`/posts/${post.slug}`}>{post.title}</Link>
              </h3>
              <span className="ml-2 text-gray-700 font-light text-xl">
                #blog-name
              </span>
              <p className="my-2">{post.body.slice(0, 75) + '...'}</p>
              <div className="flex items-center my-2">
                <StarFullIcon className="w-6 h-6 fill-current text-green-900" />
                {/* <span className="text-gray-600 ml-2">
                  {Math.floor(Math.random() * 100)}
                </span> */}
                {/* TODO: Add star number */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Homepage.propTypes = {
  posts: PropTypes.array.isRequired
};

function HomepageContainer(props) {
  const [posts, setPosts] = useState(null);
  const [status, setStatus] = useState('loading');

  function getUserPosts() {
    api('posts')
      .then(res => {
        setPosts(res.posts);
        setStatus('loaded');
      })
      .catch(err => {
        console.error(err);
        setStatus('error');
      });
  }

  useEffect(() => {
    let canceled = false;
    if (!canceled && status === 'loading') {
      getUserPosts();
    }
    return () => (canceled = true);
  }, [status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return <Homepage posts={posts} />;
}

export default HomepageContainer;
