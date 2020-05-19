import React, { useEffect } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Sidebar from './Sidebar';
import ManageBlog from './ManageBlog';
import CreateBlog from './CreateBlog';
import { useBlogs } from 'hooks/useBlog';
import DisplayError from 'components/DisplayError';
import {
  fetchUserBlogs,
  setBlogAction,
  removeBlogAction,
} from 'actions/blogActions';

function Dashboard() {
  const { blogs, loading, error, dispatch } = useBlogs();
  const { path } = useRouteMatch();

  useEffect(() => {
    dispatch(fetchUserBlogs());
  }, [dispatch]);

  const setBlog = (blog) => dispatch(setBlogAction(blog));
  const removeBlog = (blogId) => dispatch(removeBlogAction(blogId));

  if (error) {
    return <DisplayError />;
  }

  return (
    <div className="pt-16 flex flex-col lg:flex-row flex-auto flex-shrink-0 px-2 relative">
      <div className="w-full lg:max-w-xs xl:w-1/6">
        <Sidebar blogs={blogs} loading={loading} />
      </div>

      <div className="w-full xl:w-4/6 py-4">
        <Switch>
          <Route exact path={path}>
            <h3 className="text-center text-2xl lg:text-3xl leading-loose mt-6">
              Please select a blog, or create new one
            </h3>
          </Route>
          <Route path={`${path}/create-blog`}>
            <CreateBlog addBlog={setBlog} />
          </Route>
          <Route path={`${path}/:blogSlug`}>
            <ManageBlog removeBlog={removeBlog} />
          </Route>
        </Switch>
      </div>

      <div className="hidden xl:block xl:w-1/6" />
    </div>
  );
}

export default Dashboard;
