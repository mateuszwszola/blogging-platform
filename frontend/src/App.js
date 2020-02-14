import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PageContent from './components/layout/PageContent';
import {
  Homepage,
  Login,
  Register,
  ForgotPassword,
  NotFound
} from './components/pages';
import { Header } from './components/layout/Header';

function App() {
  return (
    <Router>
      <PageContent>
        <Header />
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
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </PageContent>
    </Router>
  );
}

export default App;
