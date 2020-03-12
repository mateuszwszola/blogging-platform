import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { useInput } from '../../../../hooks';
import Sidebar from './Sidebar';
import AddBlogPost from './AddBlogPost';
import CreateBlog from './CreateBlog';

function Dashboard({
  title,
  body,
  handleTitleChange,
  handleBodyChange,
  ...props
}) {
  let { path } = useRouteMatch();

  return (
    <main className="md:pt-16 flex-auto flex-shrink-0 h-screen">
      <div className="flex h-full">
        <div className="w-1/5 bg-gray-200 px-2 py-4">
          <Sidebar />
        </div>

        <div className="w-4/5 bg-gray-300 py-2 px-4">
          <Switch>
            <Route exact path={path}>
              <h3 className="text-center text-3xl leading-loose mt-6">
                Please select a blog
              </h3>
            </Route>
            <Route path={`${path}/create-blog`}>
              <CreateBlog />
            </Route>
            <Route path={`${path}/:blogName`}>
              <AddBlogPost
                title={title}
                body={body}
                handleTitleChange={handleTitleChange}
                handleBodyChange={handleBodyChange}
              />
            </Route>
          </Switch>
        </div>
      </div>
    </main>
  );
}

Dashboard.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleBodyChange: PropTypes.func.isRequired
};

function DashboardContainer(props) {
  const [title, handleTitleChange] = useInput('');
  const [body, handleBodyChange] = useInput('');

  return (
    <Dashboard
      title={title}
      handleTitleChange={handleTitleChange}
      body={body}
      handleBodyChange={handleBodyChange}
    />
  );
}

export default DashboardContainer;
