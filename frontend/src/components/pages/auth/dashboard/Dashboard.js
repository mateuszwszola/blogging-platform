import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Sidebar from './Sidebar';
import ManageBlog from './ManageBlog';
import CreateBlog from './CreateBlog';
import api from '../../../../api/api';

function Dashboard({ status, reloadBlogs, blogs, ...props }) {
  let { path } = useRouteMatch();

  return (
    <div className="flex flex-auto flex-shrink-0 md:pt-16">
      <div className="w-1/5 bg-gray-200 px-2 py-4">
        <Sidebar
          blogs={blogs}
          loading={status === 'loading'}
        />
      </div>

      <div className="w-4/5 bg-gray-300 py-2 px-4">
        <Switch>
          <Route exact path={path}>
            <h3 className="text-center text-3xl leading-loose mt-6">
              Please select a blog
            </h3>
          </Route>
          <Route path={`${path}/create-blog`}>
            <CreateBlog reloadBlogs={reloadBlogs} />
          </Route>
          <Route path={`${path}/:blogSlug`}>
            <ManageBlog reloadBlogs={reloadBlogs} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  status: PropTypes.string.isRequired,
  blogs: PropTypes.array,
  reloadBlogs: PropTypes.func.isRequired,
};

function DashboardContainer(props) {
  const [blogs, setBlogs] = useState(null);
  const [status, setStatus] = useState('loading');

  const reloadBlogs = () => {
    setStatus('loading');
  }

  useEffect(() => {
    function getUserBlogs() {
      api('blogs')
        .then(res => {
          setBlogs(res.blogs);
          setStatus('loaded');
        })
        .catch(err => {
          console.error(err);
          setStatus('error');
        });
    }

    let canceled = false;

    if (!canceled && status === 'loading') {
      getUserBlogs();
    }
    return () => (canceled = true);
  }, [status]);

  return <Dashboard status={status} reloadBlogs={reloadBlogs} blogs={blogs} />;
}

export default DashboardContainer;
