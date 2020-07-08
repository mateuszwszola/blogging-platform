import React from 'react';
import { useMutation } from 'react-query';
import { updatePassword } from 'api/auth';
import useForm from 'hooks/useForm';
import { InputGroup } from 'components/layout/Input';
import { Button } from 'components/layout/Button';
import { useAlert } from 'context/AlertContext';

const UpdatePassword = () => {
  const [makeUpdatePasswordRequest, { status, error }] = useMutation(
    updatePassword
  );
  const { setAlert } = useAlert();
  const {
    values: { currentPassword, newPassword, confirmNewPassword },
    handleChange,
    handleSubmit,
    handleReset,
    errors,
    setErrors,
  } = useForm(
    {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    handlePasswordUpdate,
    validate
  );

  async function handlePasswordUpdate() {
    makeUpdatePasswordRequest(
      { currentPassword, newPassword },
      {
        onSuccess: (res) => {
          setAlert('success', res.message, 3000);
          handleReset();
        },
        onError: (err) => {
          if (err.errors) {
            setErrors(err.errors);
          }
        },
      }
    );
  }

  return (
    <>
      {status === 'error' && <p className="text-red-500">{error.message}</p>}
      <form onSubmit={handleSubmit}>
        <InputGroup
          type="password"
          isError={!!errors.currentPassword}
          errors={errors}
          classnames="border border-gray-400 bg-gray-100"
          name="currentPassword"
          value={currentPassword}
          handleChange={handleChange}
          label="Current password"
        />
        <InputGroup
          type="password"
          isError={!!errors.newPassword}
          errors={errors}
          classnames="border border-gray-400 bg-gray-100"
          name="newPassword"
          value={newPassword}
          handleChange={handleChange}
          label="New password"
        />
        <InputGroup
          type="password"
          isError={!!errors.confirmNewPassword}
          errors={errors}
          classnames="border border-gray-400 bg-gray-100"
          name="confirmNewPassword"
          value={confirmNewPassword}
          handleChange={handleChange}
          label="Confirm new password"
        />

        <Button
          type="submit"
          fullRounded
          disabled={status === 'loading'}
          version="primary"
        >
          {status === 'loading' ? 'Loading...' : 'Change password'}
        </Button>
      </form>
    </>
  );
};

function validate(values) {
  const errors = {};
  if (!values.currentPassword) {
    errors.currentPassword = 'Current password is required';
  }
  if (!values.newPassword) {
    errors.newPassword = 'New password is required';
  }
  if (!values.confirmNewPassword) {
    errors.confirmNewPassword = 'Password confirmation is required';
  }
  return errors;
}

export default UpdatePassword;
