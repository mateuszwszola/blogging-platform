import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageContent from 'components/layout/PageContent';
import { Blog, Post, NotFound, Explore } from 'pages';
import { Homepage, Profile, Dashboard, Settings } from 'pages/auth';

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
  );
}

export default AuthenticatedApp;
