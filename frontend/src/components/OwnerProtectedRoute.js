import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch, Route, Redirect } from 'react-router-dom';

function OwnerProtectedRoute({ isOwner, children, ...props }) {
  const { url } = useRouteMatch();

  if (isOwner) {
    return <Route {...props}>{children}</Route>;
  } else {
    return <Redirect to={url} />;
  }
}

OwnerProtectedRoute.propTypes = {
  isOwner: PropTypes.bool.isRequired,
};

export default OwnerProtectedRoute;
