import { useHistory } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

function useLogoutWithRedirect() {
  const { logout } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    await logout();
    history.push('/');
  };

  return handleLogout;
}

export default useLogoutWithRedirect;
