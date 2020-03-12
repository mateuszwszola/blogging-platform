import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import profileImg from '../../img/undraw_profile.svg';

function Explore({ users, blogs, ...props }) {
  const usersCards = users.map(user => {
    const blog = blogs.find(b => b.userId === user.id);

    return (
      <div
        key={user.id}
        className="bg-gray-200 shadow py-4 px-2 rounded flex flex-col justify-between"
      >
        <div className="flex flex-col items-center text-center">
          <h3 className="cursor-pointer text-blue-700 hover:text-gray-800 text-2xl font-medium">
            Blog Title
          </h3>
          <p className="text-gray-800">{blog.title}</p>
        </div>

        <div className="flex items-center mt-5">
          <img
            src={profileImg}
            alt="profile"
            className="w-16 h-16 rounded-full"
          />
          <div className="ml-4">
            <h4 className="text-md font-medium cursor-pointer text-blue-700 hover:text-gray-800">
              {user.name}
            </h4>
            <p className="text-sm text-gray-600">{user.username}</p>
          </div>
        </div>
      </div>
    );
  });
  return (
    <main className="bg-gray-100">
      <div className="py-32 max-w-screen-xl mx-auto">
        <h2 className="text-center text-4xl uppercase font-semibold">
          Explore Blogs
        </h2>

        <div className="px-4 py-2 mt-6">
          {/* <div className="flex flex-col items-center md:justify-center md:flex-wrap md:flex-row max-w-screen-xl mx-auto">
              {usersCards}
            </div> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {usersCards}
          </div>
        </div>
      </div>
    </main>
  );
}

Explore.propTypes = {
  users: PropTypes.array.isRequired
};

function ExploreContainer() {
  const [users, setUsers] = useState(null);
  const [blogs, setBlogs] = useState(null);

  const getUsers = () => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(users => setUsers(users))
      .catch(err => {
        console.error(err);
      });
  };

  const getBlogs = () => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(res => res.json())
      .then(blogs => setBlogs(blogs))
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    console.log('component mounts');
    let canceled = false;

    if (!canceled) {
      getUsers();
      getBlogs();
    }

    return () => (canceled = true);
  }, []);

  if (users === null || blogs === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Explore users={users} blogs={blogs} />
    </>
  );
}

export default ExploreContainer;
