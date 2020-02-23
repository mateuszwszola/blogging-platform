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
