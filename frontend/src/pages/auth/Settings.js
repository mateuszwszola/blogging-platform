import React from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import Account from 'pages/auth/settings/Account';
import Profile from 'pages/auth/settings/Profile';
import Sidebar from 'pages/auth/settings/Sidebar';

function Settings() {
  const { url, path } = useRouteMatch();

  return (
    <div className="w-full max-w-screen-xl mx-auto py-16 px-2 relative">
      <div className="flex flex-col mt-6 items-center">
        <Sidebar url={url} />
        <Switch>
          <Route exact path={path}>
            <Redirect to={`${path}/profile`} />
          </Route>
          <Route path={`${path}/profile`}>
            <Profile />
          </Route>
          <Route path={`${path}/account`}>
            <Account />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default Settings;
