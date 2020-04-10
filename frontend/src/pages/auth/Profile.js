import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, Link } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

function Profile({ user, handleLogout }) {
  return (
    <div className="md:pt-16">
      <h1 className="text-2xl text-center py-6">Your Profile</h1>
      <div className="flex flex-col flex-shrink-0">
        <div className="flex justify-around">
          <button
            className="px-4 py-2 rounded border-2 border-red-500"
            onClick={handleLogout}
          >
            Log Out
          </button>
          <Link className="p-2 rounded border-2 border-gray-500" to="/settings">
            Settings
          </Link>
        </div>
        <div className="max-w-sm mx-auto mt-4 bg-green-200 px-6 py-4 rounded text-center text-xl font-bold tracking-wide">
          Hello {user.name}!
        </div>
      </div>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

function ProfileContainer(props) {
  const auth = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    await auth.logout();
    history.push('/');
  };

  return <Profile user={auth.data.user} handleLogout={handleLogout} />;
}

export default ProfileContainer;
