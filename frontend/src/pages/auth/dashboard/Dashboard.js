import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Sidebar from './Sidebar';
import ManageBlog from './ManageBlog';
import CreateBlog from './CreateBlog';
import { useUserBlogs } from 'hooks/useBlog';
import DisplayError from 'components/DisplayError';

function Dashboard(props) {
  const { blogs, status, addBlog, removeBlog } = useUserBlogs();
  let { path } = useRouteMatch();

  if (status === 'error') {
    return <DisplayError />;
  }

  return (
    <div className="flex flex-col md:flex-row flex-auto flex-shrink-0 md:pt-16">
      <div className="pt-10 md:pt-0 md:w-2/6 md:max-w-xs bg-gray-200 px-2 py-4">
        <Sidebar blogs={blogs} loading={status === 'loading'} />
      </div>

      <div className="w-full flex-auto bg-gray-300 py-2 px-4">
        <Switch>
          <Route exact path={path}>
            <h3 className="text-center text-3xl leading-loose mt-6">
              Please select a blog, or create new one
            </h3>
          </Route>
          <Route path={`${path}/create-blog`}>
            <CreateBlog addBlog={addBlog} />
          </Route>
          <Route path={`${path}/:blogSlug`}>
            <ManageBlog removeBlog={removeBlog} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default Dashboard;
