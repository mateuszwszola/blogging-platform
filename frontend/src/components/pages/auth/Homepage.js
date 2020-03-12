import React from 'react';
import PropTypes from 'prop-types';
import { CalendarIcon, StarFullIcon } from '../../../icons';
import dummyPosts from './posts.json';
import { Link } from 'react-router-dom';

function Homepage({ posts, loading, ...props }) {
  return (
    <div className="md:pt-16 pb-16 max-w-screen-xl mx-auto mt-6">
      <h1 className="text-3xl text-center leading-loose">Your Blog posts</h1>
      <div className="flex flex-col items-center px-2 py-2">
        <>
          {posts.map(post => (
            <div key={post.id} className="mt-20">
              <img
                src="https://picsum.photos/seed/picsum/600/300"
                alt=""
                className="max-w-full rounded"
              />
              <div className="">
                <div className="flex items-center m-2">
                  <CalendarIcon className="w-6 h-6 fill-current text-gray-600" />
                  <span className="text-gray-600 ml-2">{post.created}</span>
                </div>

                <h3 className="my-2 text-3xl uppercase font-semibold cursor-pointer hover:underline">
                  <Link to={`/posts/${post.title.toLowerCase()}-${post.id}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="my-2">{post.description.slice(0, 75) + '...'}</p>
                <div className="flex items-center m-2">
                  <StarFullIcon className="w-6 h-6 fill-current text-green-900" />
                  <span className="text-gray-600 ml-2">
                    {Math.floor(Math.random() * 100)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </>
      </div>
    </div>
  );
}

Homepage.propTypes = {
  posts: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

function HomepageContainer(props) {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getPosts = async () => {
    setLoading(true);
    // const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    // const posts = await res.json();
    await Promise.resolve(() => {
      setTimeout(null, 2000);
    });
    setPosts(dummyPosts);
    setLoading(false);
  };

  React.useEffect(() => {
    getPosts();
  }, []);

  return <Homepage posts={posts} loading={loading} />;
}

export default HomepageContainer;
