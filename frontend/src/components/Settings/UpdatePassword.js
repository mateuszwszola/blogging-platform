import React from 'react';
import useForm from 'hooks/useForm';
import { InputGroup } from 'components/layout/Input';

const UpdatePassword = () => {
  const {
    values: { oldPassword, newPassword, confirmNewPassword },
    handleChange,
    handleSubmit,
  } = useForm(
    {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    updatePassword
  );

  function updatePassword() {
    console.log('update password');
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        classnames="border border-gray-400 bg-white"
        name="oldPassword"
        value={oldPassword}
        handleChange={handleChange}
        label="Old password"
      />
      <InputGroup
        classnames="border border-gray-400"
        name="newPassword"
        value={newPassword}
        handleChange={handleChange}
        label="New password"
      />
      <InputGroup
        classnames="border border-gray-400"
        name="confirmNewPassword"
        value={confirmNewPassword}
        handleChange={handleChange}
        label="Confirm new password"
      />
    </form>
  );
};

export default UpdatePassword;
