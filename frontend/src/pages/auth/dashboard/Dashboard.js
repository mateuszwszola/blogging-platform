import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Sidebar from './Sidebar';
import ManageBlog from './ManageBlog';
import CreateBlog from './CreateBlog';
import { useUserBlogs } from 'hooks/useBlog';
import DisplayError from 'components/DisplayError';
import Loading from 'components/Loading';
import { useUser } from 'context/UserContext';

function Dashboard() {
  const { user } = useUser();
  const { status, data: blogs, error } = useUserBlogs(user && user._id);
  const { path } = useRouteMatch();

  return (
    <div className="pt-16 flex flex-col lg:flex-row flex-auto flex-shrink-0 px-2 relative">
      {status === 'loading' ? (
        <Loading />
      ) : status === 'error' ? (
        <DisplayError
          msg={error.message || 'There were a problem loading blogs'}
        />
      ) : (
        <>
          <div className="w-full lg:max-w-xs xl:w-1/6">
            <Sidebar blogs={blogs} />
          </div>

          <div className="w-full xl:w-4/6 py-4">
            <Switch>
              <Route exact path={path}>
                <h3 className="text-center text-2xl lg:text-3xl leading-loose mt-6">
                  Please select a blog, or create new one
                </h3>
              </Route>
              <Route path={`${path}/create-blog`}>
                <CreateBlog />
              </Route>
              <Route path={`${path}/:blogSlug`}>
                <ManageBlog />
              </Route>
            </Switch>
          </div>
        </>
      )}

      <div className="hidden xl:block xl:w-1/6" />
    </div>
  );
}

export default Dashboard;
