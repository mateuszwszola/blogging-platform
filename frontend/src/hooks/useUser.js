import { useMutation } from 'react-query';
import { updateUser, uploadUserAvatar } from 'api/user';

function useUpdateUser() {
  return useMutation((data) => updateUser(data).then((res) => res.user));
}

function useUploadUserAvatar() {
  return useMutation((data) =>
    uploadUserAvatar(data.photoFile).then((res) => res.photoURL)
  );
}

export { useUpdateUser, useUploadUserAvatar };
