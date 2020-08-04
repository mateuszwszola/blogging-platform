import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageContent from 'components/PageContent';
import Blog from 'pages/Blog';
import Post from 'pages/Post';
import Explore from 'pages/Explore';
import Profile from 'pages/Profile';
import Dashboard from 'pages/auth/Dashboard';
import Settings from 'pages/auth/Settings';
import Homepage from 'pages/auth/Homepage';
import NotFound from 'pages/NotFound';

function AuthenticatedApp() {
  return (
    <PageContent>
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route path="/explore">
          <Explore />
        </Route>
        <Route path="/profile/:userId">
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
  );
}

export default AuthenticatedApp;
