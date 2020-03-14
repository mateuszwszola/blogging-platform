import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PageContent from './components/layout/PageContent';
import { NotFound, Explore } from './components/pages';
import {
  Homepage,
  Profile,
  Dashboard,
  Settings,
  Post
} from './components/pages/auth';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

function AuthenticatedApp() {
  return (
    <Router>
      <Header />
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
          <Route>
            <NotFound />
          </Route>
        </Switch>
        <Footer />
      </PageContent>
    </Router>
  );
}

export default AuthenticatedApp;
