import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageContent from 'components/PageContent';
import Homepage from 'pages/Homepage';
import Login from 'pages/Login';
import Register from 'pages/Register';
import ForgotPassword from 'pages/ForgotPassword';
import ResetPassword from 'pages/ResetPassword';
import Explore from 'pages/Explore';
import Post from 'pages/Post';
import Blog from 'pages/Blog';
import Profile from 'pages/Profile';
import NotFound from 'pages/NotFound';

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
        <Route path="/forgotpassword">
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
