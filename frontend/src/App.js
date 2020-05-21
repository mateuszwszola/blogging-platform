import React, { useEffect } from 'react';
import { useUser } from 'context/UserContext';
import Loading from 'components/Loading';

const loadAuthenticatedApp = () => import('./AuthenticatedApp');
const AuthenticatedApp = React.lazy(() => import('./AuthenticatedApp'));
const UnauthenticatedApp = React.lazy(() => import('./UnauthenticatedApp'));

function App() {
  const { user } = useUser();

  useEffect(() => {
    loadAuthenticatedApp();
  }, []);
  return (
    <>
      <React.Suspense fallback={<Loading />}>
        {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </React.Suspense>
    </>
  );
}

export default App;
