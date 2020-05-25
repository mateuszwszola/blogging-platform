import React from 'react';
import UpdateUserForm from 'components/UpdateUserForm';

function Settings(props) {
  return (
    <div className="md:pt-16">
      <h1 className="text-2xl text-center py-6">Settings</h1>
      <div className="w-full max-w-md mx-auto mt-4">
        <UpdateUserForm />
      </div>
    </div>
  );
}

export default Settings;
