import React from 'react';
import UpdateUserForm from 'components/UpdateUserForm';
import AvatarUpload from 'components/AvatarUpload';

const Profile = () => (
  <div className="w-full max-w-md mt-6 lg:mt-0 bg-white shadow-md rounded-lg py-4 px-2 lg:px-4 xl:px-8">
    <h3 className="text-2xl text-center py-1">Public profile</h3>
    <hr />
    <div className="w-full max-w-sm mx-auto mt-4">
      <AvatarUpload />
      <UpdateUserForm />
    </div>
  </div>
);

export default Profile;
