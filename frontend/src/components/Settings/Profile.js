import React from 'react';
import UpdateUserForm from 'components/UpdateUserForm';
import AvatarUpload from 'components/AvatarUpload';

const Profile = () => (
  <div className="w-full max-w-sm mt-6 lg:mt-0">
    <h3 className="text-2xl text-center py-1">Public profile</h3>
    <hr />
    <div className="w-full max-w-sm mt-4">
      <AvatarUpload />
      <UpdateUserForm />
    </div>
  </div>
);

export default Profile;
