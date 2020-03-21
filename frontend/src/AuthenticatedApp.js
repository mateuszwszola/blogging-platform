import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PageContent from './components/layout/PageContent';
import { NotFound, Explore } from './components/pages';
import {
  Homepage,
  Profile,
  Dashboard,
  Settings
} from './components/pages/auth';
import { Blog, Post } from './components/pages';

function AuthenticatedApp() {
  return (
    <Router>
      <PageContent>
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route path="/explore">
            <Explore />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/posts/:postSlug">
            <Post />
          </Route>
          <Route path="/blogs/:blogSlug">
            <Blog />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </PageContent>
    </Router>
  );
}

export default AuthenticatedApp;
