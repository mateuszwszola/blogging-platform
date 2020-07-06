import React from 'react';
import { useUser } from 'context/UserContext';
import { useAlert } from 'context/AlertContext';
import { useUpdateUser } from 'hooks/useUser';
import useForm from 'hooks/useForm';
import updateUserValidationRules from 'utils/updateUserValidatoinRules';
import { InputGroup } from 'components/layout/Input';
import { Button } from './layout/Button';
import { LoadingWithOverlay } from './Loading';

function UpdateUserForm() {
  const { user, setUser } = useUser();
  const [updateUser, { status, error }] = useUpdateUser();
  const {
    handleChange,
    handleSubmit,
    values: { name, bio },
    errors,
    setErrors,
  } = useForm(
    {
      name: (user && user.name) || '',
      bio: (user && user.bio) || '',
    },
    handleUpdateUser,
    updateUserValidationRules
  );

  const { setAlert } = useAlert();

  function handleUpdateUser() {
    const newUserData = { name, bio };

    updateUser(newUserData, {
      onSuccess: (updatedUser) => {
        setAlert('success', 'Profile updated!');
        setUser(updatedUser);
      },
      onError: (err) => {
        if (err.errors) {
          setErrors(err.errors);
        } else {
          setErrors({
            message: err.message || 'There was the problem with the server',
          });
        }
      },
    });
  }

  const buttonDisabled = user && user.name === name && user.bio === bio;

  return (
    <div className="relative">
      {error && (
        <p className="text-red-500 text-sm text-center">
          {errors.message || 'Cannot update the user'}
        </p>
      )}
      {status === 'loading' && <LoadingWithOverlay />}
      <form
        onSubmit={handleSubmit}
        className={`${status === 'loading' ? 'opacity-75' : 'opacity-100'}`}
      >
        <InputGroup
          classnames="border border-gray-400"
          isError={!!(errors.name || errors.message)}
          errors={errors}
          value={name}
          handleChange={handleChange}
          name="name"
          label="User Name"
        />
        <InputGroup
          classnames="border border-gray-400"
          isError={!!(errors.bio || errors.message)}
          errors={errors}
          value={bio}
          handleChange={handleChange}
          name="bio"
          label="User Bio"
        />

        <Button
          type="submit"
          disabled={buttonDisabled}
          size="base"
          version="primary"
          fullWidth
          fullRounded
        >
          <span className="uppercase font-bold text-sm">Update User</span>
        </Button>
      </form>
    </div>
  );
}

export default UpdateUserForm;
