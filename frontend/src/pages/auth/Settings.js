import React from 'react';
import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';
import { Account, Sidebar, Profile } from 'components/Settings';

function Settings() {
  const match = useRouteMatch();

  return (
    <div className="w-full max-w-screen-xl mx-auto py-16 px-2 relative">
      <div className="flex flex-col mt-6 items-center">
        <Sidebar url={match.url} />
        <Switch>
          <Route exact path={match.path}>
            <Redirect to={`${match.path}/profile`} />
          </Route>
          <Route path={`${match.path}/profile`}>
            <Profile />
          </Route>
          <Route path={`${match.path}/account`}>
            <Account />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default Settings;
