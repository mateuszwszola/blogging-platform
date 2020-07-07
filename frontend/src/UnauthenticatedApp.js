import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageContent from 'components/layout/PageContent';
import {
  Homepage,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  NotFound,
  Explore,
  Blog,
  Post,
  Profile,
} from 'pages';

function UnauthenticatedApp() {
  return (
    <PageContent>
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/resetpassword/:userId/:token">
          <ResetPassword />
        </Route>
        <Route path="/explore">
          <Explore />
        </Route>
        <Route path="/posts/:postSlug">
          <Post />
        </Route>
        <Route path="/blogs/:blogSlug">
          <Blog />
        </Route>
        <Route path="/profile/:userId">
          <Profile />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </PageContent>
  );
}

export default UnauthenticatedApp;
