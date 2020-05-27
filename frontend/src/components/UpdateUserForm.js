import React from 'react';
import { useUser } from 'context/UserContext';
import useForm from 'hooks/useForm';
import { InputGroup, InputSubmit } from 'components/layout/Input';
import { LoadingWithOverlay } from './Loading';
import updateUserValidationRules from 'utils/updateUserValidatoinRules';
import { useAlert } from 'context/AlertContext';
import { useUpdateUser } from 'hooks/useUser';

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

        <InputSubmit
          disabled={buttonDisabled}
          value="Update User"
          classnames="w-1/2 max-w-sm mx-auto block my-6 bg-green-300 hover:bg-green-400 transition duration-100"
        />
      </form>
    </div>
  );
}

export default UpdateUserForm;
