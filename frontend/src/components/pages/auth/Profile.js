import React from 'react';
import PropTypes from 'prop-types';
import { useUser } from '../../../context/UserContext';

function Profile({ user }) {
  return (
    <div className="md:pt-16">
      <h1 className="text-2xl text-center py-6">Your Profile</h1>
      <div className="max-w-sm mx-auto mt-4 bg-green-200 px-6 py-4 rounded text-center text-xl font-bold tracking-wide">
        Hello {user.name}!
      </div>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.object.isRequired
};

function ProfileContainer(props) {
  const user = useUser();

  return <Profile user={user} />;
}

export default ProfileContainer;
