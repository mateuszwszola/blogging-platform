import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PageContent from './components/layout/PageContent';
import { NotFound, Explore } from './components/pages';
import { Header } from './components/layout/Header';

function AuthenticatedApp() {
  return (
    <Router>
      <PageContent>
        <Header />
        <Switch>
          <Route exact path="/">
            <div>
              <h1>Authenticated Homepage</h1>
              <p>List of posts</p>
            </div>
          </Route>
          <Route path="/explore">
            <Explore />
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
